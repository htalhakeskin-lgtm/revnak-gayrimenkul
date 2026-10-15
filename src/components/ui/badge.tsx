import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const tones = {
  gold: "bg-gold text-night",
  glass: "bg-night/70 text-ivory backdrop-blur-md ring-1 ring-white/10",
  outline: "ring-1 ring-line text-fg",
  success: "bg-success text-ivory",
  ivory: "bg-ivory text-ink",
  muted: "bg-fg/8 text-fg",
} as const;

export function Badge({
  tone = "glass",
  className,
  ...props
}: ComponentProps<"span"> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.08em] uppercase",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
