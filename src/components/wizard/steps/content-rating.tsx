"use client";
import { useWizard } from "@/lib/store";

const QUESTIONS: { id: string; q: string; }[] = [
  { id: "violence", q: "Does the app contain violence or scenes of violence?" },
  { id: "sexual", q: "Does the app contain sexual content, nudity, or innuendo?" },
  { id: "profanity", q: "Does the app contain profanity or crude humor?" },
  { id: "drugs", q: "Does the app reference drugs, alcohol, or tobacco?" },
  { id: "gambling", q: "Does the app contain gambling or real-money gaming?" },
  { id: "ugc", q: "Does the app allow user-generated content?" },
  { id: "location", q: "Does the app share user location with others?" },
];

function derive(answers: Record<string, "yes" | "no">) {
  const yes = (k: string) => answers[k] === "yes";
  if (yes("gambling") || yes("sexual")) return "adults-18";
  if (yes("violence") && yes("profanity")) return "mature-17";
  if (yes("violence") || yes("profanity") || yes("drugs")) return "teen";
  if (yes("ugc") || yes("location")) return "everyone-10";
  return "everyone";
}

export function StepContentRating() {
  const w = useWizard();
  function set(id: string, v: "yes" | "no") {
    const next = { ...w.ratingAnswers, [id]: v };
    w.set({ ratingAnswers: next, derivedRating: derive(next) as "everyone" });
  }
  return (
    <div className="space-y-3">
      {QUESTIONS.map((q) => (
        <div key={q.id} className="p-4 rounded-xl border border-border bg-bg-2">
          <p className="text-sm mb-2">{q.q}</p>
          <div className="flex gap-2">
            {(["yes", "no"] as const).map((v) => (
              <button
                key={v}
                onClick={() => set(q.id, v)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium border ${
                  w.ratingAnswers[q.id] === v
                    ? "bg-brand-indigo/20 border-brand-indigo/50 text-indigo-100"
                    : "border-border text-text-muted hover:border-border-strong"
                }`}
              >
                {v === "yes" ? "Yes" : "No"}
              </button>
            ))}
          </div>
        </div>
      ))}
      {w.derivedRating && (
        <p className="text-sm text-text-muted">
          Estimated rating: <span className="text-text font-semibold">{w.derivedRating}</span>
        </p>
      )}
    </div>
  );
}
