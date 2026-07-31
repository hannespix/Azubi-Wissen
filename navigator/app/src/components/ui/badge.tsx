import * as React from "react";
import { cn } from "@/lib/utils";

const stile: Record<string, string> = {
  neutral: "border border-[var(--linie)] text-[var(--text-leise)]",
  geprueft: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100",
  warnung: "bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100",
  akzent: "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] border border-stone-900",
};

export function Badge({
  variante = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variante?: keyof typeof stile }) {
  return (
    <span
      className={cn("inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium", stile[variante], className)}
      {...props}
    />
  );
}

export function StatusBadge({ status }: { status: string }) {
  const variante = status.includes("geprüft") ? "geprueft" : status === "veraltet" ? "warnung" : "neutral";
  return <Badge variante={variante}>{status}</Badge>;
}
