import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Form alanları: görünür etiket, hata mesajı ekran okuyucuya bağlı (Bölüm 4.6).
 * Ton duyarlı: koyu ve açık bölümlerde aynı bileşen çalışır.
 */

const controlClass =
  "w-full rounded-xl border bg-raised px-4 text-[0.9375rem] text-fg placeholder:text-fg-muted/80 transition-colors focus:border-accent focus:outline-none aria-[invalid=true]:border-danger";

export function FieldShell({
  id,
  label,
  error,
  hint,
  optional,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-xs font-semibold tracking-[0.12em] text-fg-muted uppercase">
        {label}
        {optional ? <span className="ml-1 font-normal tracking-normal normal-case opacity-70">(isteğe bağlı)</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-xs text-fg-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-sm font-medium text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type BaseProps = { label: string; error?: string; hint?: string; optional?: boolean; wrapperClassName?: string };

export function TextField({
  id,
  label,
  error,
  hint,
  optional,
  wrapperClassName,
  className,
  ...props
}: BaseProps & ComponentProps<"input"> & { id: string }) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} className={wrapperClassName}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(controlClass, "h-12 border-line", className)}
        {...props}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  id,
  label,
  error,
  hint,
  optional,
  wrapperClassName,
  className,
  ...props
}: BaseProps & ComponentProps<"textarea"> & { id: string }) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} className={wrapperClassName}>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(controlClass, "min-h-28 border-line py-3 leading-relaxed", className)}
        {...props}
      />
    </FieldShell>
  );
}

export function SelectField({
  id,
  label,
  error,
  hint,
  optional,
  wrapperClassName,
  className,
  children,
  ...props
}: BaseProps & ComponentProps<"select"> & { id: string }) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} className={wrapperClassName}>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(controlClass, "h-12 border-line", className)}
        {...props}
      >
        {children}
      </select>
    </FieldShell>
  );
}

/** KVKK aydınlatma onayı (zorunlu) + ticari ileti izni (isteğe bağlı, İYS) — Bölüm 13.2 */
export function ConsentFields({ idPrefix, error }: { idPrefix: string; error?: string }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed">
      <div>
        <label htmlFor={`${idPrefix}-kvkk`} className="flex cursor-pointer gap-3 text-fg">
          <input
            id={`${idPrefix}-kvkk`}
            name="kvkk"
            type="checkbox"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${idPrefix}-kvkk-error` : undefined}
            className="mt-1 size-4 shrink-0 accent-[var(--tone-accent)]"
          />
          <span>
            <Link href="/kvkk" target="_blank" className="text-accent underline underline-offset-4">
              KVKK aydınlatma metnini
            </Link>{" "}
            okudum; talebimin yanıtlanması için verilerimin işlenmesini kabul ediyorum.
          </span>
        </label>
        {error ? (
          <p id={`${idPrefix}-kvkk-error`} className="mt-1 ml-7 text-sm font-medium text-danger" role="alert">
            {error}
          </p>
        ) : null}
      </div>
      <label htmlFor={`${idPrefix}-iys`} className="flex cursor-pointer gap-3 text-fg-muted">
        <input id={`${idPrefix}-iys`} name="iys" type="checkbox" className="mt-1 size-4 shrink-0 accent-[var(--tone-accent)]" />
        <span>Yeni ilanlar ve kampanyalar hakkında ticari elektronik ileti almak istiyorum (isteğe bağlı).</span>
      </label>
    </div>
  );
}

/** Botların doldurduğu gizli alan */
export function Honeypot() {
  return (
    <div aria-hidden className="sr-only">
      <label>
        Web siteniz
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
