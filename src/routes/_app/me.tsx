import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { signOut } from "@/lib/auth/client";
import { UserButton } from "@/lib/auth/gates";
import { deleteMyAccount, getMyProfile, updateSafety } from "@/lib/aura-api";
import { VISIBILITY, type Profile, type Visibility } from "@/lib/aura";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileView } from "@/components/profile-view";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/me")({ component: MePage });

function MePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [visibility, setVisibility] = useState<Visibility>("open");
  const [trusted, setTrusted] = useState("");
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    void getMyProfile().then((p) => {
      if (!p) return;
      setProfile(p);
      setVisibility(p.visibility);
      setTrusted(p.trustedContact);
    });
  }, []);

  if (!profile) {
    return <div className="m-5 h-96 animate-pulse rounded-xl bg-elevated" />;
  }

  return (
    <div className="px-4 pt-4 pb-10">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">You</p>
          <h1 className="font-display text-3xl font-medium">Your signal</h1>
        </div>
        <Link to="/onboard" className="text-sm text-muted underline-offset-4 hover:underline">
          Edit
        </Link>
      </div>

      {visibility === "ghost" ? (
        <p className="mb-4 rounded-lg border border-border bg-elevated px-3 py-2 text-sm text-muted">
          Ghost is on. Nearby people cannot find you in Discover or on the map.
        </p>
      ) : null}

      <ProfileView person={profile} />

      <section className="mt-8 rounded-xl border border-border bg-surface px-4 py-5">
        <h2 className="font-display text-xl">Safety</h2>
        <p className="mt-1 text-sm text-muted">
          Neighborhood only. Never a pin. Ghost whenever you need the room to go dark.
        </p>
        <div className="mt-4 grid gap-2">
          {VISIBILITY.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVisibility(v.id)}
              className={cn(
                "rounded-lg border px-3 py-2.5 text-left",
                visibility === v.id
                  ? "border-border-strong bg-elevated"
                  : "border-border",
              )}
            >
              <p className="text-sm font-medium">{v.label}</p>
              <p className="text-xs text-muted">{v.hint}</p>
            </button>
          ))}
        </div>
        <label className="mt-4 flex flex-col gap-1.5">
          <Label>Trusted contact</Label>
          <Input
            value={trusted}
            onChange={(e) => setTrusted(e.target.value)}
            placeholder="Someone who would pick up"
          />
        </label>
        <Button
          className="mt-4"
          variant="outline"
          onClick={async () => {
            const next = await updateSafety({
              data: { visibility, trustedContact: trusted },
            });
            if (next) setProfile(next);
            setSaved(true);
            window.setTimeout(() => setSaved(false), 1600);
          }}
        >
          {saved ? "Saved" : "Save safety"}
        </Button>
      </section>

      <div className="mt-8 flex items-center justify-between gap-3">
        <UserButton />
      </div>

      <section className="mt-8 rounded-xl border border-border px-4 py-5">
        <h2 className="font-display text-xl">Leave</h2>
        <p className="mt-1 text-sm text-muted">
          Deleting your profile removes matches, messages, and posts from this app.
        </p>
        {confirmDelete ? (
          <div className="mt-4 flex flex-col gap-2">
            <p className="text-sm text-danger">This cannot be undone.</p>
            <Button
              variant="danger"
              disabled={deleting}
              onClick={async () => {
                setDeleting(true);
                try {
                  await deleteMyAccount();
                  await signOut("/");
                  await navigate({ to: "/" });
                } finally {
                  setDeleting(false);
                }
              }}
            >
              {deleting ? "Deleting…" : "Delete my profile"}
            </Button>
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
              Keep my profile
            </Button>
          </div>
        ) : (
          <Button className="mt-4" variant="outline" onClick={() => setConfirmDelete(true)}>
            Delete profile
          </Button>
        )}
      </section>

      <p className="mt-6 flex gap-3 text-xs text-subtle">
        <Link to="/privacy" className="underline-offset-4 hover:underline">
          Privacy
        </Link>
        <Link to="/terms" className="underline-offset-4 hover:underline">
          Terms
        </Link>
      </p>
    </div>
  );
}
