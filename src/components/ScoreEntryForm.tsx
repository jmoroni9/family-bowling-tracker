"use client";

import { useState } from "react";
import { BOWLERS, ALLEYS, BOWLER_CONFIG } from "@/lib/constants";

interface Props {
  onSuccess: () => void;
}

type ScoreMap = Record<string, Record<number, string>>;

const today = () => new Date().toISOString().split("T")[0];

export default function ScoreEntryForm({ onSuccess }: Props) {
  const [date, setDate] = useState(today());
  const [alley, setAlley] = useState<string>(ALLEYS[0]);
  const [gameCount, setGameCount] = useState(2);
  const [scores, setScores] = useState<ScoreMap>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const setScore = (bowler: string, game: number, value: string) => {
    setScores((prev) => ({
      ...prev,
      [bowler]: { ...prev[bowler], [game]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);

    // Build score entries — skip blank inputs
    const entries: { bowler: string; gameNumber: number; score: number }[] = [];
    for (const bowler of BOWLERS) {
      for (let g = 1; g <= gameCount; g++) {
        const raw = scores[bowler]?.[g] ?? "";
        if (raw === "") continue;
        const num = Number(raw);
        if (isNaN(num) || num < 0 || num > 300) {
          setError(`Invalid score for ${bowler} Game ${g} — must be 0–300.`);
          setSubmitting(false);
          return;
        }
        entries.push({ bowler, gameNumber: g, score: num });
      }
    }

    if (entries.length === 0) {
      setError("Please enter at least one score before submitting.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, alley, scores: entries }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Unknown error");

      setSuccessMsg(`🎳 ${data.saved} score${data.saved !== 1 ? "s" : ""} saved! Great bowling!`);
      setScores({});
      setGameCount(2);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const gameNumbers = Array.from({ length: gameCount }, (_, i) => i + 1);

  return (
    <section>
      <div className="text-center mb-6">
        <h2 className="font-display text-4xl sm:text-5xl text-white mb-1">
          📝 Log Scores
        </h2>
        <p className="text-white/40 text-sm font-semibold uppercase tracking-widest">
          Enter today&apos;s session
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/10 bg-lane-card p-5 pin-stripe"
      >
        {/* Date + Alley row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-1">
              Bowling Alley
            </label>
            <select
              value={alley}
              onChange={(e) => setAlley(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 appearance-none"
            >
              {ALLEYS.map((a) => (
                <option key={a} value={a} className="bg-lane-card">
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Score table */}
        <div className="overflow-x-auto -mx-1 px-1 mb-4">
          <table className="w-full min-w-[280px]">
            <thead>
              <tr>
                <th className="text-left text-xs font-bold uppercase tracking-widest text-white/50 pb-3 pr-3 w-[40%]">
                  Bowler
                </th>
                {gameNumbers.map((g) => (
                  <th
                    key={g}
                    className="text-center text-xs font-bold uppercase tracking-widest text-white/50 pb-3 px-1"
                  >
                    Game {g}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {BOWLERS.map((bowler) => {
                const cfg = BOWLER_CONFIG[bowler];
                return (
                  <tr key={bowler}>
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0"
                          style={{ backgroundColor: cfg.color + "33", border: `2px solid ${cfg.color}` }}
                        >
                          {cfg.emoji}
                        </span>
                        <span
                          className="font-display text-lg leading-none"
                          style={{ color: cfg.color }}
                        >
                          {bowler}
                        </span>
                      </div>
                    </td>
                    {gameNumbers.map((g) => (
                      <td key={g} className="py-2 px-1">
                        <input
                          type="number"
                          min={0}
                          max={300}
                          placeholder="—"
                          value={scores[bowler]?.[g] ?? ""}
                          onChange={(e) => setScore(bowler, g, e.target.value)}
                          className="w-full text-center rounded-lg bg-white/5 border border-white/10 text-white font-bold text-base py-2 px-1 focus:outline-none focus:ring-2 transition-all"
                          style={{ minWidth: "56px" }}
                          onFocus={(e) =>
                            (e.target.style.borderColor = cfg.color)
                          }
                          onBlur={(e) => (e.target.style.borderColor = "")}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Add extra game */}
        <button
          type="button"
          onClick={() => setGameCount((n) => Math.min(n + 1, 8))}
          className="w-full mb-4 rounded-xl border border-dashed border-white/20 text-white/40 hover:text-white/70 hover:border-white/40 text-sm py-2 transition-all font-semibold"
        >
          + Extra Game (Game {gameCount + 1})
        </button>

        {/* Status messages */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm px-4 py-3 font-semibold">
            ❌ {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 rounded-xl bg-green-500/15 border border-green-500/30 text-green-300 text-sm px-4 py-3 font-semibold animate-score-pop">
            {successMsg}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl py-4 font-display text-2xl text-lane transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: submitting
              ? "#666"
              : "linear-gradient(135deg, #FFD700, #FF9F1C)",
          }}
        >
          {submitting ? "Saving…" : "🎳 Submit Scores"}
        </button>
      </form>
    </section>
  );
}
