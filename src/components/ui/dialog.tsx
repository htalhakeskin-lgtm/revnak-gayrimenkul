"use client";

import { useLenis } from "lenis/react";
import { X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Yerel <dialog> tabanlı pencere: odak tuzağı, Esc ile kapanma ve arka planı
 * etkisizleştirme tarayıcıdan gelir (erişilebilirlik, Bölüm 4.6).
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  className,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  size?: "md" | "lg" | "full";
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      lenis?.stop();
    } else if (!open && dialog.open) {
      dialog.close();
    }
    if (!open) lenis?.start();
  }, [open, lenis]);

  // Sayfa Activity ile gizlenirse (Cache Components) pencere açık kalmasın.
  useLayoutEffect(() => {
    const dialog = ref.current;
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      data-lenis-prevent
      aria-labelledby="dialog-title"
      className={cn(
        "tone-dark m-auto max-h-[92dvh] overflow-hidden rounded-[20px] border border-night-line bg-night-raised p-0 text-ivory shadow-[0_40px_120px_rgb(0_0_0/0.6)] backdrop:bg-transparent",
        size === "md" && "w-[min(560px,calc(100vw-32px))]",
        size === "lg" && "w-[min(860px,calc(100vw-32px))]",
        size === "full" && "h-dvh max-h-dvh w-screen max-w-none rounded-none border-0",
        className,
      )}
    >
      {open ? (
        <div className={cn("flex max-h-[92dvh] flex-col", size === "full" && "h-dvh max-h-dvh")}>
          <div className="flex items-start justify-between gap-6 border-b border-night-line px-6 py-5">
            <div>
              <h2 id="dialog-title" className="text-h3">
                {title}
              </h2>
              {description ? <p className="mt-1.5 text-sm text-muted">{description}</p> : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="-mr-2 grid size-10 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-ivory"
              aria-label="Kapat"
            >
              <X size={20} />
            </button>
          </div>
          <div className="overflow-y-auto overscroll-contain px-6 py-6">{children}</div>
        </div>
      ) : null}
    </dialog>
  );
}
