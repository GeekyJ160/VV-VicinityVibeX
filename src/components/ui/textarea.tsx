import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-lg border border-border bg-elevated px-3 py-2.5 text-sm text-fg placeholder:text-subtle outline-none transition-shadow duration-150 focus-visible:ring-2 focus-visible:ring-accent/35",
        className,
      )}
      {...props}
    />
  );
}
