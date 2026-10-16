import { and, count, desc, eq, gte, inArray } from "drizzle-orm";
import { db } from "./client";
import { appointments, leads } from "./schema";

/**
 * Veritabanı sorguları (K20). Sunucu eylemleri ve panel sayfaları buradan okur/yazar.
 * Statik ilan/bölge/danışman verisi hâlâ src/lib/data.ts üzerinden (Bölüm 20.8).
 */

export type LeadInsert = typeof leads.$inferInsert;
export type LeadRow = typeof leads.$inferSelect;
export type AppointmentInsert = typeof appointments.$inferInsert;
export type AppointmentRow = typeof appointments.$inferSelect;

export async function insertLead(row: LeadInsert) {
  await db().insert(leads).values(row);
}

export async function insertAppointment(row: AppointmentInsert) {
  await db().insert(appointments).values(row);
}

/** Aynı danışman/tarih/saat için onaylı bir randevu var mı? (Sunucu tarafı çakışma kontrolü, İP-23) */
export async function hasConfirmedAppointment(agentSlug: string, date: string, time: string) {
  const rows = await db()
    .select({ id: appointments.id })
    .from(appointments)
    .where(
      and(
        eq(appointments.agentSlug, agentSlug),
        eq(appointments.date, date),
        eq(appointments.time, time),
        eq(appointments.status, "onaylandi"),
      ),
    )
    .limit(1);
  return rows.length > 0;
}

export async function getRecentLeads(limit = 50): Promise<LeadRow[]> {
  return db().select().from(leads).orderBy(desc(leads.createdAt)).limit(limit);
}

export async function countLeadsSince(sinceIso: string): Promise<number> {
  const [row] = await db()
    .select({ n: count() })
    .from(leads)
    .where(gte(leads.createdAt, new Date(sinceIso)));
  return row?.n ?? 0;
}

/** Danışmanın `fromDate` (YYYY-MM-DD) ve sonrasındaki onaylı randevu saatleri — formda dolu gösterilir */
export async function getBookedSlots(agentSlug: string, fromDate: string) {
  return db()
    .select({ date: appointments.date, time: appointments.time })
    .from(appointments)
    .where(
      and(
        eq(appointments.agentSlug, agentSlug),
        gte(appointments.date, fromDate),
        eq(appointments.status, "onaylandi"),
      ),
    );
}

export async function getAppointmentsForDates(dates: string[]): Promise<AppointmentRow[]> {
  if (dates.length === 0) return [];
  return db()
    .select()
    .from(appointments)
    .where(and(inArray(appointments.date, dates), eq(appointments.status, "onaylandi")))
    .orderBy(appointments.date, appointments.time);
}

export async function getUpcomingAppointments(limit = 100): Promise<AppointmentRow[]> {
  return db()
    .select()
    .from(appointments)
    .where(eq(appointments.status, "onaylandi"))
    .orderBy(appointments.date, appointments.time)
    .limit(limit);
}
