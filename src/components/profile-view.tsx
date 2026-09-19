import type { ReactNode } from "react";
import { BadgeCheck } from "lucide-react";
import {
  DIMENSIONS,
  intentionLabel,
  styleLabel,
  universeName,
  vibeColor,
  type DiscoverCard,
  type Profile,
} from "@/lib/aura";
import { Badge } from "@/components/ui/badge";
import { VibeOrb } from "@/components/vibe-orb";
import { cn } from "@/lib/utils";

export function ProfileView({
  person,
  className,
  actions,
}: {
  person: Profile | DiscoverCard;
  className?: string;
  actions?: ReactNode;
}) {
  const photo = person.photos[0];
  const color = vibeColor(person);
  const compat = "compatibility" in person ? person.compatibility : null;
  const shared = "sharedDimensions" in person ? person.sharedDimensions : [];

  return (
    <article className={cn("flex flex-col", className)}>
      <div className="relative overflow-hidden rounded-xl bg-elevated">
        <div className="relative aspect-[4/5] max-h-[46dvh] w-full">
          {photo ? (
            <img
              src={photo}
              alt=""
              crossOrigin="anonymous"
              className="absolute inset-0 size-full object-cover outline outline-1 -outline-offset-1 outline-fg/10"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 40% 30%, ${color.glow}, ${color.css} 40%, #0c0b0a 78%)`,
              }}
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-bg/80 via-transparent to-transparent" />
        </div>
      </div>

      <div className="flex items-end gap-3 px-1 pt-4">
        <VibeOrb
          primary={person.primary}
          secondary={person.secondary}
          saturation={person.saturation}
          brightness={person.brightness}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h2 className="truncate font-display text-2xl font-medium tracking-tight">
              {person.displayName}
            </h2>
            {person.verified ? (
              <BadgeCheck className="size-4 shrink-0 text-ok" strokeWidth={1.75} />
            ) : null}
          </div>
          <p className="truncate text-sm text-muted">
            {person.pronouns}
            {person.pronouns && person.neighborhood ? " · " : ""}
            {person.neighborhood}
          </p>
        </div>
        {compat != null ? (
          <div className="text-right">
            <p className="font-display text-2xl font-medium tabular-nums leading-none">{compat}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted">freq</p>
          </div>
        ) : null}
      </div>

      {actions}

      <div className="flex flex-col gap-5 px-1 pt-5">
        {person.voiceIntro ? (
          <p className="font-display text-lg leading-snug text-fg/90">
            {person.voiceIntro}
          </p>
        ) : null}
        {person.bio ? <p className="text-sm leading-relaxed text-muted">{person.bio}</p> : null}

        <div className="flex flex-wrap gap-1.5">
          {person.universes.map((id) => (
            <Badge key={id}>{universeName(id)}</Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          <span>{styleLabel(person.relationshipStyle)}</span>
          {person.intentions.map((id) => (
            <span key={id}>{intentionLabel(id)}</span>
          ))}
        </div>

        {shared.length > 0 ? (
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.14em] text-subtle">
              Shared dimensions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {shared.map((key) => (
                <Badge key={key} className="border-border-strong text-fg">
                  {DIMENSIONS[key].label}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}

        <DimensionList person={person} highlight={shared} />

        {person.perfectLocalDay ? (
          <section>
            <p className="mb-1.5 text-xs uppercase tracking-[0.14em] text-subtle">
              A perfect local day
            </p>
            <p className="text-sm leading-relaxed text-fg/90">{person.perfectLocalDay}</p>
          </section>
        ) : null}

        {person.greenFlags.length > 0 ? (
          <section>
            <p className="mb-1.5 text-xs uppercase tracking-[0.14em] text-subtle">
              Green flags
            </p>
            <ul className="space-y-1 text-sm text-fg/90">
              {person.greenFlags.map((flag) => (
                <li key={flag}>{flag}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {person.redFlags.length > 0 ? (
          <section>
            <p className="mb-1.5 text-xs uppercase tracking-[0.14em] text-subtle">
              Red flags
            </p>
            <ul className="space-y-1 text-sm text-muted">
              {person.redFlags.map((flag) => (
                <li key={flag}>{flag}</li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </article>
  );
}

function DimensionList({
  person,
  highlight,
}: {
  person: Profile;
  highlight: string[];
}) {
  const keys = Object.keys(person.dimensions) as (keyof typeof person.dimensions)[];
  const ranked = [...keys].sort((a, b) => person.dimensions[b] - person.dimensions[a]);
  return (
    <section>
      <p className="mb-2 text-xs uppercase tracking-[0.14em] text-subtle">Vibe DNA</p>
      <ul className="space-y-2">
        {ranked.map((key) => {
          const meta = DIMENSIONS[key];
          const value = person.dimensions[key];
          const on = highlight.includes(key);
          return (
            <li key={key}>
              <div className="mb-1 flex justify-between text-xs">
                <span className={on ? "text-fg" : "text-muted"}>{meta.label}</span>
                <span className="tabular-nums text-subtle">{value}</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-elevated">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${value}%`,
                    background: on ? vibeColor(person).css : "rgb(243 239 232 / 0.28)",
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
