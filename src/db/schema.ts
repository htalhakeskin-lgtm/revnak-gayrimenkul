import { boolean, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Veritabanı şeması (K20). Gerçek, kalıcı kayıtlar: formlar ve randevular.
 * İlan/bölge/danışman verisi hâlâ src/data/*.ts'de statik (Bölüm 20.8'de Payload'a taşınacak).
 */

export const leads = pgTable("leads", {
  id: varchar("id", { length: 36 }).primaryKey(),
  ref: varchar("ref", { length: 16 }).notNull(),
  kind: varchar("kind", { length: 20 }).notNull(), // iletisim | ilan-bilgi | portfoy | degerleme
  name: varchar("name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(), // +90XXXXXXXXXX
  email: varchar("email", { length: 160 }),
  message: text("message"),
  listingNo: varchar("listing_no", { length: 16 }),
  region: varchar("region", { length: 40 }),
  propertyType: varchar("property_type", { length: 40 }),
  m2: integer("m2"),
  rooms: varchar("rooms", { length: 20 }),
  buildingAge: varchar("building_age", { length: 20 }),
  condition: varchar("condition", { length: 40 }),
  iysConsent: boolean("iys_consent").notNull().default(false),
  consentVersion: varchar("consent_version", { length: 20 }).notNull().default("v0.1-demo"),
  status: varchar("status", { length: 20 }).notNull().default("yeni"), // yeni | iletisimde | kapandi
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: varchar("id", { length: 36 }).primaryKey(),
  ref: varchar("ref", { length: 16 }).notNull(),
  agentSlug: varchar("agent_slug", { length: 60 }).notNull(),
  listingSlug: varchar("listing_slug", { length: 160 }),
  kind: varchar("kind", { length: 20 }).notNull(), // yerinde | ofis | goruntulu
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  time: varchar("time", { length: 5 }).notNull(), // HH:mm
  name: varchar("name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 160 }),
  note: text("note"),
  iysConsent: boolean("iys_consent").notNull().default(false),
  status: varchar("status", { length: 20 }).notNull().default("bekliyor"), // bekliyor | onaylandi | iptal
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Panel oturumu: tek admin hesabı, parola hash'i ortam değişkeninde (Bölüm 13.1: 2FA üretimde eklenir) */
export const panelSessions = pgTable("panel_sessions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow(),
  userAgent: varchar("user_agent", { length: 300 }),
});
