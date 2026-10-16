import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function FormSuccess({
  title,
  message,
  refNo,
  children,
}: {
  title: string;
  message: string;
  refNo: string;
  children?: ReactNode;
}) {
  return (
    <div role="status" className="animate-page-in text-center">
      <CheckCircle2 size={44} className="mx-auto text-accent" aria-hidden />
      <h3 className="mt-5 text-h3">{title}</h3>
      <p className="mx-auto mt-3 max-w-md leading-relaxed text-fg-muted">{message}</p>
      <p className="mt-4 text-sm text-fg-muted">
        Takip numaranız: <strong className="tabular text-fg">{refNo}</strong>
      </p>
      {children}
      <p className="mx-auto mt-6 max-w-md text-xs leading-relaxed text-fg-muted">
        Demo: Firma kurgusal, veri saklanması gerçektir. Gönderiminiz veritabanına kaydedildi ve{" "}
        <Link href="/panel/talepler" className="text-accent underline underline-offset-4">
          ofis panelinde
        </Link>{" "}
        görünüyor. Henüz e-posta/SMS bildirimi gönderilmiyor.
      </p>
    </div>
  );
}
