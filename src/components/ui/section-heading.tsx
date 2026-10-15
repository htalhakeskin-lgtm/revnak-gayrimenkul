import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col md:items-center",
        className,
      )}
    >
      <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
        <Heading className={Heading === "h1" ? "text-h1" : "text-h2"}>{title}</Heading>
        {description ? (
          <p className="mt-5 text-base leading-relaxed text-fg-muted md:text-lg">{description}</p>
        ) : null}
      </Reveal>
      {action ? <Reveal delay={0.1}>{action}</Reveal> : null}
    </div>
  );
}
