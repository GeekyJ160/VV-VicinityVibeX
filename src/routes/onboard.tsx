import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  EMOJI_MARKS,
  FREQUENCY_QUESTIONS,
  INTENTIONS,
  NEIGHBORHOODS,
  RELATIONSHIP_STYLES,
  UNIVERSES,
  VISIBILITY,
  computeDna,
  type Visibility,
} from "@/lib/aura";
import { getMyProfile, saveProfile } from "@/lib/aura-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VibeOrb } from "@/components/vibe-orb";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboard")({ component: Onboard });

function Onboard() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [emoji, setEmoji] = useState<string>("◎");
  const [pronouns, setPronouns] = useState("");
  const [neighborhood, setNeighborhood] = useState("Deep Ellum");
  const [bio, setBio] = useState("");
  const [voiceIntro, setVoiceIntro] = useState("");
  const [perfectLocalDay, setPerfectLocalDay] = useState("");
  const [intentions, setIntentions] = useState<string[]>(["dating"]);
  const [relationshipStyle, setRelationshipStyle] = useState("slow-burn");
  const [greenFlags, setGreenFlags] = useState<string[]>([]);
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [universes, setUniverses] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, "a" | "b">>({});
  const [visibility, setVisibility] = useState<Visibility>("open");
  const [trustedContact, setTrustedContact] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isPending || !user) return;
    setDisplayName((n) => n || user.displayName || "");
    void getMyProfile()
      .then((p) => {
        if (p) {
          setDisplayName(p.displayName);
          setEmoji(p.emoji);
          setPronouns(p.pronouns);
          setNeighborhood(p.neighborhood || "Deep Ellum");
          setBio(p.bio);
          setVoiceIntro(p.voiceIntro);
          setPerfectLocalDay(p.perfectLocalDay);
          setIntentions(p.intentions);
          setRelationshipStyle(p.relationshipStyle);
          setGreenFlags(p.greenFlags);
          setRedFlags(p.redFlags);
          setUniverses(p.universes);
          setVisibility(p.visibility);
          setTrustedContact(p.trustedContact);
        }
      })
      .finally(() => setReady(true));
  }, [isPending, user]);

  const dna = useMemo(() => computeDna(universes, answers), [universes, answers]);

  if (isPending) {
    return <div className="min-h-dvh bg-bg" />;
  }
  if (!user) return <RedirectToSignIn />;
  if (!ready) {
    return <div className="min-h-dvh bg-bg" />;
  }

  const steps = ["You", "Connect", "Worlds", "Frequency"];
  const canNext =
    step === 0
      ? displayName.trim().length > 1 && pronouns.trim().length > 0
      : step === 1
        ? intentions.length > 0 && bio.trim().length > 8
        : step === 2
          ? universes.length >= 2
          : Object.keys(answers).length === FREQUENCY_QUESTIONS.length;

  async function finish() {
    setSaving(true);
    setError(null);
    try {
      await saveProfile({
        data: {
          displayName,
          emoji,
          bio,
          voiceIntro,
          pronouns,
          intentions,
          relationshipStyle,
          greenFlags,
          redFlags,
          perfectLocalDay,
          dimensions: dna.dimensions,
          saturation: dna.saturation,
          brightness: dna.brightness,
          neighborhood,
          visibility,
          trustedContact,
          universes,
          photoUrl: user?.profileImageUrl,
        },
      });
      await navigate({ to: "/discover" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col px-5 pb-10 pt-8">
      <div className="mb-8 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">
          {steps[step]}
        </p>
        <p className="text-xs tabular-nums text-subtle">{step + 1} / 4</p>
      </div>
      <div className="mb-8 h-px bg-border">
        <div
          className="h-px bg-accent transition-[width] duration-300 ease-out"
          style={{ width: `${((step + 1) / 4) * 100}%` }}
        />
      </div>

      {step === 0 ? (
        <section className="flex flex-col gap-5">
          <h1 className="font-display text-3xl font-medium">Who are you here as?</h1>
          <Field label="Name">
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </Field>
          <Field label="Pronouns">
            <Input
              value={pronouns}
              placeholder="she/her, they/them…"
              onChange={(e) => setPronouns(e.target.value)}
            />
          </Field>
          <Field label="Neighborhood">
            <select
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm text-fg outline-none focus-visible:ring-2 focus-visible:ring-accent/35"
            >
              {NEIGHBORHOODS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </Field>
          <div>
            <Label>Mark</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {EMOJI_MARKS.map((mark) => (
                <button
                  key={mark}
                  type="button"
                  onClick={() => setEmoji(mark)}
                  className={cn(
                    "grid size-11 place-items-center rounded-md border text-lg",
                    emoji === mark
                      ? "border-border-strong bg-elevated text-fg"
                      : "border-border text-muted",
                  )}
                >
                  {mark}
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {step === 1 ? (
        <section className="flex flex-col gap-5">
          <h1 className="font-display text-3xl font-medium">How do you want to be met?</h1>
          <Field label="A line they hear first">
            <Input
              value={voiceIntro}
              placeholder="The thing I want is…"
              onChange={(e) => setVoiceIntro(e.target.value)}
            />
          </Field>
          <Field label="Bio">
            <Textarea
              value={bio}
              placeholder="Specific. Not a resume."
              onChange={(e) => setBio(e.target.value)}
            />
          </Field>
          <Field label="A perfect local day">
            <Textarea
              value={perfectLocalDay}
              placeholder="Where you go. What you eat. When you go home."
              onChange={(e) => setPerfectLocalDay(e.target.value)}
            />
          </Field>
          <div>
            <Label>Looking for</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {INTENTIONS.map((item) => (
                <Chip
                  key={item.id}
                  on={intentions.includes(item.id)}
                  onClick={() =>
                    setIntentions((cur) =>
                      cur.includes(item.id)
                        ? cur.filter((x) => x !== item.id)
                        : [...cur, item.id],
                    )
                  }
                >
                  {item.label}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <Label>Relationship style</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {RELATIONSHIP_STYLES.map((item) => (
                <Chip
                  key={item.id}
                  on={relationshipStyle === item.id}
                  onClick={() => setRelationshipStyle(item.id)}
                >
                  {item.label}
                </Chip>
              ))}
            </div>
          </div>
          <FlagEditor label="Green flags" values={greenFlags} onChange={setGreenFlags} />
          <FlagEditor label="Red flags" values={redFlags} onChange={setRedFlags} />
        </section>
      ) : null}

      {step === 2 ? (
        <section className="flex flex-col gap-5">
          <h1 className="font-display text-3xl font-medium">Which rooms do you keep?</h1>
          <p className="text-sm text-muted">Pick two to four universes.</p>
          <ul className="flex flex-col gap-2">
            {UNIVERSES.map((u) => {
              const on = universes.includes(u.id);
              return (
                <li key={u.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setUniverses((cur) => {
                        if (cur.includes(u.id)) return cur.filter((x) => x !== u.id);
                        if (cur.length >= 4) return cur;
                        return [...cur, u.id];
                      })
                    }
                    className={cn(
                      "w-full rounded-lg border px-4 py-3 text-left transition-colors duration-150",
                      on ? "border-border-strong bg-elevated" : "border-border",
                    )}
                  >
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{u.description}</p>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <VibeOrb
              primary={dna.primary}
              secondary={dna.secondary}
              saturation={dna.saturation}
              brightness={dna.brightness}
              size="lg"
            />
            <div>
              <h1 className="font-display text-3xl font-medium">Your frequency</h1>
              <p className="mt-1 text-sm text-muted">Four choices. Then you are in.</p>
            </div>
          </div>
          {FREQUENCY_QUESTIONS.map((q) => (
            <div key={q.id}>
              <p className="mb-2 text-sm">{q.prompt}</p>
              <div className="grid gap-2">
                {(["a", "b"] as const).map((side) => (
                  <button
                    key={side}
                    type="button"
                    onClick={() => setAnswers((cur) => ({ ...cur, [q.id]: side }))}
                    className={cn(
                      "rounded-lg border px-4 py-3 text-left text-sm",
                      answers[q.id] === side
                        ? "border-border-strong bg-elevated"
                        : "border-border text-muted",
                    )}
                  >
                    {q[side].label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div>
            <Label>Who can find you</Label>
            <div className="mt-2 grid gap-2">
              {VISIBILITY.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVisibility(v.id)}
                  className={cn(
                    "rounded-lg border px-4 py-3 text-left",
                    visibility === v.id
                      ? "border-border-strong bg-elevated"
                      : "border-border",
                  )}
                >
                  <p className="text-sm font-medium">{v.label}</p>
                  <p className="mt-0.5 text-xs text-muted">{v.hint}</p>
                </button>
              ))}
            </div>
          </div>
          <Field label="Trusted contact (optional)">
            <Input
              value={trustedContact}
              placeholder="Name and number of someone you trust"
              onChange={(e) => setTrustedContact(e.target.value)}
            />
          </Field>
        </section>
      ) : null}

      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}

      <div className="mt-auto flex gap-3 pt-8">
        {step > 0 ? (
          <Button variant="outline" className="flex-1" onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
        ) : null}
        {step < 3 ? (
          <Button className="flex-1" disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
            Continue
          </Button>
        ) : (
          <Button className="flex-1" disabled={!canNext || saving} onClick={() => void finish()}>
            {saving ? "Saving…" : "Enter Vicinity Vibe"}
          </Button>
        )}
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </label>
  );
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm",
        on ? "border-border-strong bg-elevated text-fg" : "border-border text-muted",
      )}
    >
      {children}
    </button>
  );
}

function FlagEditor({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {values.map((v) => (
          <button
            key={v}
            type="button"
            className="rounded-full border border-border bg-elevated px-3 py-1 text-xs text-fg"
            onClick={() => onChange(values.filter((x) => x !== v))}
          >
            {v}
          </button>
        ))}
      </div>
      <Input
        className="mt-2"
        value={draft}
        placeholder="Type a line, then Enter"
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          e.preventDefault();
          const next = draft.trim();
          if (!next || values.includes(next)) return;
          onChange([...values, next]);
          setDraft("");
        }}
      />
    </div>
  );
}
