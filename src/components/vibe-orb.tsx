import { vibeColor, type DimensionKey } from "@/lib/aura";
import { cn } from "@/lib/utils";

export function VibeOrb({
  primary,
  secondary,
  saturation,
  brightness,
  size = "md",
  className,
}: {
  primary: DimensionKey;
  secondary: DimensionKey;
  saturation: number;
  brightness: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const color = vibeColor({ primary, secondary, saturation, brightness });
  const dim =
    size === "sm"
      ? "size-9"
      : size === "md"
        ? "size-14"
        : size === "lg"
          ? "size-24"
          : "size-40";

  return (
    <span
      aria-hidden
      className={cn("relative inline-grid place-items-center", dim, className)}
    >
      <span
        className="absolute inset-[-18%] rounded-full opacity-70 blur-xl"
        style={{ background: color.glow }}
      />
      <span
        className="relative block size-full rounded-full"
        style={{
          background: `radial-gradient(circle at 32% 28%, ${color.soft}, ${color.css} 58%, color-mix(in oklab, ${color.css} 55%, black) 100%)`,
          boxShadow: `inset 0 0 0 1px rgb(243 239 232 / 0.18)`,
        }}
      />
    </span>
  );
}
