"use client";

import { Building2, CalendarPlus, Home, Loader2, Video } from "lucide-react";
import { useMemo, useState, useTransition, type FormEvent } from "react";
import { bookAppointment, type ActionResult } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  APPOINTMENT_MINUTES,
  bookableDays,
  getSlots,
  todayInIstanbul,
} from "@/lib/availability";
import { appointmentsStore, newId } from "@/lib/demo-store";
import { useHydrated, useNow } from "@/lib/hooks";
import { buildIcs, downloadIcs } from "@/lib/ics";
import { appointmentSchema, formDataToObject, zodErrors, type FieldErrors } from "@/lib/schemas";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { ConsentFields, SelectField, TextAreaField, TextField } from "./fields";
import { FormSuccess } from "./form-success";

type AgentOption = { slug: string; name: string; title: string };
type ListingOption = { slug: string; no: string; title: string; agentSlug: string; locationLabel: string };

const kinds = [
  { value: "yerinde", label: "Yerinde gösterim", text: "Danışmanımızla mülkte buluşun.", Icon: Home },
  { value: "ofis", label: "Ofiste görüşme", text: "Bebek ofisimizde yüz yüze.", Icon: Building2 },
  { value: "goruntulu", label: "Görüntülü görüşme", text: "Canlı video ile uzaktan gösterim.", Icon: Video },
] as const;

type Kind = (typeof kinds)[number]["value"];

const dayFormat = new Intl.DateTimeFormat("tr-TR", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const longFormat = new Intl.DateTimeFormat("tr-TR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

function asUtcDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/**
 * Randevu (M05 / İP-23): 3 randevu tipi, müsaitlik, çakışma kontrolü, .ics.
 * Tarihler "bugün"e bağlı olduğu için yalnızca tarayıcıda hesaplanır.
 */
export function AppointmentForm({
  agents,
  listing,
  defaultAgentSlug,
  idPrefix = "appt",
}: {
  agents: AgentOption[];
  listing?: ListingOption;
  defaultAgentSlug?: string;
  idPrefix?: string;
}) {
  const hydrated = useHydrated();
  const now = useNow();
  const localAppointments = appointmentsStore.use();
  const [kind, setKind] = useState<Kind>(listing ? "yerinde" : "ofis");
  const [agentSlug, setAgentSlug] = useState(listing?.agentSlug ?? defaultAgentSlug ?? agents[0]?.slug ?? "");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<ActionResult | null>(null);
  const [booked, setBooked] = useState<{ date: string; time: string; ref: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const days = useMemo(() => (hydrated ? bookableDays(todayInIstanbul(new Date())) : []), [hydrated]);
  const firstAvailable = useMemo(
    () => days.find((d) => getSlots(agentSlug, d, now ? new Date(now) : undefined).some((s) => !s.busy)) ?? days[0],
    [days, agentSlug, now],
  );
  const activeDate = date || firstAvailable || "";

  const slots = useMemo(() => {
    if (!activeDate || !agentSlug) return [];
    const takenLocally = new Set(
      localAppointments.filter((a) => a.agentSlug === agentSlug && a.date === activeDate).map((a) => a.time),
    );
    return getSlots(agentSlug, activeDate, now ? new Date(now) : undefined).map((s) => ({
      ...s,
      busy: s.busy || takenLocally.has(s.time),
    }));
  }, [activeDate, agentSlug, localAppointments, now]);

  const agent = agents.find((a) => a.slug === agentSlug);
  const availableKinds = listing ? kinds : kinds.filter((k) => k.value !== "yerinde");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const local = appointmentSchema.safeParse(formDataToObject(data));
    if (!local.success) {
      setErrors(zodErrors(local.error));
      return;
    }
    setErrors({});
    startTransition(async () => {
      const res = await bookAppointment(data);
      setResult(res);
      if (!res.ok) {
        setErrors(res.errors);
        return;
      }
      appointmentsStore.set((prev) => [
        {
          id: newId(),
          ref: res.ref,
          agentSlug: local.data.agentSlug,
          listingSlug: local.data.listingSlug,
          kind: local.data.kind,
          date: local.data.date,
          time: local.data.time,
          name: local.data.name,
          phone: local.data.phone,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setBooked({ date: local.data.date, time: local.data.time, ref: res.ref });
    });
  }

  if (result?.ok && booked) {
    const kindLabel = kinds.find((k) => k.value === kind)?.label ?? "Randevu";
    const location =
      kind === "yerinde" && listing
        ? `${listing.locationLabel} (adres randevu onayıyla paylaşılır)`
        : kind === "ofis"
          ? `${siteConfig.fullName}, ${siteConfig.contact.addressLine}, ${siteConfig.contact.district}/${siteConfig.contact.city}`
          : "Görüntülü görüşme bağlantısı e-postayla gönderilecek";
    return (
      <FormSuccess title="Randevunuz oluşturuldu" message={result.message} refNo={booked.ref}>
        <div className="mx-auto mt-6 max-w-sm rounded-[14px] border border-line bg-raised p-5 text-left text-sm">
          <p className="font-semibold text-fg">{kindLabel}</p>
          <p className="mt-1 text-fg-muted">
            {longFormat.format(asUtcDate(booked.date))} · {booked.time}
          </p>
          <p className="mt-1 text-fg-muted">Danışman: {agent?.name}</p>
          {listing ? <p className="mt-1 text-fg-muted">İlan: {listing.no}</p> : null}
        </div>
        <Button
          variant="outline"
          className="mt-5"
          onClick={() =>
            downloadIcs(
              `revnak-randevu-${booked.ref}.ics`,
              buildIcs({
                uid: booked.ref,
                date: booked.date,
                time: booked.time,
                durationMinutes: APPOINTMENT_MINUTES,
                title: `${kindLabel} · ${siteConfig.fullName}`,
                description: `Danışman: ${agent?.name ?? ""}${listing ? `\nİlan: ${listing.no} ${listing.title}` : ""}\nTakip no: ${booked.ref}`,
                location,
                stamp: new Date().toISOString(),
              }),
            )
          }
        >
          <CalendarPlus size={18} /> Takvime ekle (.ics)
        </Button>
      </FormSuccess>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="date" value={activeDate} />
      <input type="hidden" name="time" value={time} />
      {listing ? <input type="hidden" name="listingSlug" value={listing.slug} /> : null}
      {listing ? <input type="hidden" name="agentSlug" value={agentSlug} /> : null}

      <fieldset>
        <legend className="mb-3 text-xs font-semibold tracking-[0.12em] text-fg-muted uppercase">1. Randevu tipi</legend>
        <div className={cn("grid gap-3", availableKinds.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
          {availableKinds.map(({ value, label, text, Icon }) => (
            <button
              key={value}
              type="button"
              aria-pressed={kind === value}
              onClick={() => setKind(value)}
              className={cn(
                "rounded-[14px] border p-4 text-left transition-colors",
                kind === value ? "border-accent bg-accent/10" : "border-line bg-raised hover:border-accent",
              )}
            >
              <Icon size={20} className="text-accent" aria-hidden />
              <span className="mt-3 block font-semibold text-fg">{label}</span>
              <span className="mt-1 block text-xs text-fg-muted">{text}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {!listing ? (
        <SelectField
          id={`${idPrefix}-agent`}
          name="agentSlug"
          label="2. Danışman"
          value={agentSlug}
          onChange={(e) => {
            setAgentSlug(e.target.value);
            setTime("");
          }}
          error={errors.agentSlug}
        >
          {agents.map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.name} · {a.title}
            </option>
          ))}
        </SelectField>
      ) : (
        <p className="text-sm text-fg-muted">
          Danışman: <strong className="text-fg">{agent?.name}</strong> · İlan {listing.no}
        </p>
      )}

      <fieldset>
        <legend className="mb-3 text-xs font-semibold tracking-[0.12em] text-fg-muted uppercase">
          {listing ? "2" : "3"}. Tarih ve saat
        </legend>
        {!hydrated ? (
          <div className="h-36 animate-pulse rounded-[14px] bg-fg/5" aria-hidden />
        ) : (
          <>
            <div className="snap-strip -mx-1 gap-2 px-1 pb-2" role="group" aria-label="Tarih" data-lenis-prevent-horizontal>
              {days.map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-pressed={activeDate === d}
                  onClick={() => {
                    setDate(d);
                    setTime("");
                  }}
                  className={cn(
                    "min-w-20 rounded-[14px] border px-3 py-3 text-center text-sm capitalize transition-colors",
                    activeDate === d ? "border-fg bg-fg text-bg" : "border-line bg-raised text-fg hover:border-accent",
                  )}
                >
                  {dayFormat.format(asUtcDate(d))}
                </button>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6" role="group" aria-label="Saat">
              {slots.map((s) => (
                <button
                  key={s.time}
                  type="button"
                  disabled={s.busy}
                  aria-pressed={time === s.time}
                  onClick={() => setTime(s.time)}
                  className={cn(
                    "tabular h-11 rounded-full border text-sm font-semibold transition-colors",
                    s.busy && "cursor-not-allowed border-transparent bg-fg/5 text-fg-muted/60 line-through",
                    !s.busy && time === s.time && "border-accent bg-accent text-bg",
                    !s.busy && time !== s.time && "border-line bg-raised text-fg hover:border-accent",
                  )}
                  aria-label={s.busy ? `${s.time} dolu` : `${s.time} müsait`}
                >
                  {s.time}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-fg-muted">
              Üstü çizili saatler dolu veya geçmiş. Her gösterim {APPOINTMENT_MINUTES} dakika sürer; aralarda 30 dakika tampon bırakılır.
            </p>
            {errors.time || errors.date ? (
              <p className="mt-2 text-sm font-medium text-danger" role="alert">
                {errors.time ?? errors.date}
              </p>
            ) : null}
          </>
        )}
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-3 text-xs font-semibold tracking-[0.12em] text-fg-muted uppercase">
          {listing ? "3" : "4"}. İletişim bilgileri
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField id={`${idPrefix}-name`} name="name" label="Ad soyad" autoComplete="name" error={errors.name} />
          <TextField
            id={`${idPrefix}-phone`}
            name="phone"
            label="Telefon"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="05xx xxx xx xx"
            error={errors.phone}
          />
        </div>
        <TextField id={`${idPrefix}-email`} name="email" label="E-posta" type="email" autoComplete="email" optional error={errors.email} />
        <TextAreaField id={`${idPrefix}-note`} name="note" label="Not" optional placeholder="Eklemek istedikleriniz" />
        <ConsentFields idPrefix={idPrefix} error={errors.kvkk} />
      </fieldset>

      {result && !result.ok ? (
        <p className="text-sm font-medium text-danger" role="alert">
          {result.message}
        </p>
      ) : null}
      <Button type="submit" size="lg" disabled={pending || !time} className="w-full sm:w-auto">
        {pending ? <Loader2 size={18} className="animate-spin" /> : null}
        {pending ? "Oluşturuluyor…" : time ? `Randevuyu onayla · ${time}` : "Önce saat seçin"}
      </Button>
    </form>
  );
}
