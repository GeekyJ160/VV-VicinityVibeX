import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { blockUser, getPerson, reportUser, swipe } from "@/lib/aura-api";
import { REPORT_REASONS, type DiscoverCard } from "@/lib/aura";
import { Button } from "@/components/ui/button";
import { ProfileView } from "@/components/profile-view";

export const Route = createFileRoute("/_app/people/$userId")({ component: PersonPage });

function PersonPage() {
  const { userId } = Route.useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState<DiscoverCard | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const [safety, setSafety] = useState<"idle" | "menu" | "report">("idle");
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    void getPerson({ data: userId })
      .then(setPerson)
      .catch(() => setPerson(null));
  }, [userId]);

  if (person === undefined) {
    return <div className="m-5 h-96 animate-pulse rounded-xl bg-elevated" />;
  }
  if (!person) {
    return (
      <div className="px-5 pt-16 text-center">
        <p className="font-display text-2xl">This person is ghosting the room</p>
        <Link to="/discover" className="mt-4 inline-block text-sm text-muted underline">
          Discover
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-8">
      <button
        type="button"
        className="mb-3 text-xs uppercase tracking-[0.16em] text-muted"
        onClick={() => window.history.back()}
      >
        Back
      </button>
      <ProfileView person={person} />
      <div className="mt-6 flex gap-3">
        <Button
          className="flex-1"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              const result = await swipe({ data: { toUserId: person.userId, action: "spark" } });
              if (result.matched) {
                await navigate({ to: "/chat/$chatId", params: { chatId: result.chatId } });
              } else {
                setNote("Spark sent. If they spark back, they land in Matches.");
              }
            } finally {
              setBusy(false);
            }
          }}
        >
          Spark
        </Button>
        <Button variant="outline" onClick={() => setSafety(safety === "idle" ? "menu" : "idle")}>
          Safety
        </Button>
      </div>
      {note ? <p className="mt-3 text-sm text-muted">{note}</p> : null}

      {safety === "menu" ? (
        <div className="fixed inset-x-0 bottom-20 z-30 mx-auto max-w-lg px-4">
          <div className="rounded-xl border border-border bg-surface px-4 py-4 shadow-soft">
            <p className="text-sm text-muted">
              Block hides them from you. Report also hides them and logs a reason.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={async () => {
                  await blockUser({ data: person.userId });
                  await navigate({ to: "/discover" });
                }}
              >
                Block
              </Button>
              <Button variant="danger" onClick={() => setSafety("report")}>
                Report and block
              </Button>
              <Button variant="ghost" onClick={() => setSafety("idle")}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {safety === "report" ? (
        <div className="fixed inset-x-0 bottom-20 z-30 mx-auto max-w-lg px-4">
          <div className="rounded-xl border border-border bg-surface px-4 py-4 shadow-soft">
            <p className="font-display text-xl">Why are you reporting?</p>
            <div className="mt-3 flex flex-col gap-2">
              {REPORT_REASONS.map((reason) => (
                <Button
                  key={reason.id}
                  variant="outline"
                  onClick={async () => {
                    await reportUser({
                      data: { userId: person.userId, reason: reason.id },
                    });
                    await navigate({ to: "/discover" });
                  }}
                >
                  {reason.label}
                </Button>
              ))}
              <Button variant="ghost" onClick={() => setSafety("idle")}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
