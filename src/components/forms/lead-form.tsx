"use client";

import { Loader2 } from "lucide-react";
import { useState, useTransition, type FormEvent, type ReactNode } from "react";
import { submitLead, type ActionResult } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { leadsStore, newId, type DemoLead } from "@/lib/demo-store";
import { formDataToObject, leadSchema, zodErrors, type FieldErrors } from "@/lib/schemas";
import { ConsentFields, Honeypot, TextAreaField, TextField } from "./fields";
import { FormSuccess } from "./form-success";

/**
 * İletişim / ilan bilgi talebi formu (M09).
 * Tarayıcıda Zod ile anında doğrulama, ardından sunucu eylemiyle yeniden doğrulama.
 */
export function LeadForm({
  kind = "iletisim",
  listingNo,
  defaultMessage,
  submitLabel = "Gönder",
  idPrefix = "lead",
  extraFields,
}: {
  kind?: DemoLead["kind"];
  listingNo?: string;
  defaultMessage?: string;
  submitLabel?: string;
  idPrefix?: string;
  extraFields?: ReactNode;
}) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const local = leadSchema.safeParse(formDataToObject(data));
    if (!local.success) {
      const errs = zodErrors(local.error);
      setErrors(errs);
      const first = Object.keys(errs)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    startTransition(async () => {
      const res = await submitLead(data);
      setResult(res);
      if (!res.ok) {
        setErrors(res.errors);
        return;
      }
      leadsStore.set((prev) =>
        [
          {
            id: newId(),
            kind,
            name: local.data.name,
            phone: local.data.phone,
            email: local.data.email,
            message: local.data.message,
            listingNo,
            createdAt: new Date().toISOString(),
            ref: res.ref,
          },
          ...prev,
        ].slice(0, 30),
      );
    });
  }

  if (result?.ok) {
    return <FormSuccess title="Teşekkürler!" message={result.message} refNo={result.ref} />;
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-5">
      <Honeypot />
      <input type="hidden" name="kind" value={kind} />
      {listingNo ? <input type="hidden" name="listingNo" value={listingNo} /> : null}
      {extraFields}
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          id={`${idPrefix}-name`}
          name="name"
          label="Ad soyad"
          autoComplete="name"
          error={errors.name}
          required
        />
        <TextField
          id={`${idPrefix}-phone`}
          name="phone"
          label="Telefon"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="05xx xxx xx xx"
          error={errors.phone}
          required
        />
      </div>
      <TextField
        id={`${idPrefix}-email`}
        name="email"
        label="E-posta"
        type="email"
        autoComplete="email"
        optional
        error={errors.email}
      />
      <TextAreaField
        id={`${idPrefix}-message`}
        name="message"
        label="Mesajınız"
        optional
        defaultValue={defaultMessage}
        error={errors.message}
      />
      <ConsentFields idPrefix={idPrefix} error={errors.kvkk} />
      {result && !result.ok ? (
        <p className="text-sm font-medium text-danger" role="alert">
          {result.message}
        </p>
      ) : null}
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending}>
        {pending ? <Loader2 size={18} className="animate-spin" /> : null}
        {pending ? "Gönderiliyor…" : submitLabel}
      </Button>
    </form>
  );
}
