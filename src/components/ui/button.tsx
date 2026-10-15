import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold tracking-wide whitespace-nowrap select-none transition-[background-color,color,border-color,transform,opacity] duration-150 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary: "bg-gold text-night hover:bg-[#d3b47f]",
  outline: "border border-line text-fg hover:border-accent hover:text-accent",
  ghost: "text-fg hover:bg-fg/8",
  ivory: "bg-ivory text-ink hover:bg-white",
  dark: "bg-night text-ivory hover:bg-night-raised",
  link: "rounded-none px-0 text-accent underline-offset-4 hover:underline",
} as const;

const sizes = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-[0.9375rem]",
  icon: "size-11",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(base, variants[variant], variant !== "link" && sizes[size], className);
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <Link className={buttonClasses({ variant, size, className })} {...props} />;
}
