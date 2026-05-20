"use client";

import { useState, useEffect, useCallback } from "react";
import Leaderboard from "./Leaderboard";
import ScoreEntryForm from "./ScoreEntryForm";
import type { LeaderboardEntry } from "@/lib/constants";

export default function BowlingApp() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setFetchError(null);
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load");
      setLeaderboard(data.leaderboard);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load leaderboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handleScoreSuccess = () => {
    // Briefly show loading state while refreshing leaderboard
    setLoading(true);
    fetchLeaderboard();
  };

  return (
    <div className="min-h-screen pin-stripe">
      {/* App header */}
      <header className="relative overflow-hidden py-8 px-4 text-center mb-2">
        {/* Decorative glow behind title */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(255,215,0,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Decorative pins */}
        <div className="absolute top-4 left-4 text-3xl opacity-20 animate-pin-wobble hidden sm:block">
          🎳
        </div>
        <div
          className="absolute top-4 right-4 text-3xl opacity-20 hidden sm:block"
          style={{ animationDelay: "0.5s" }}
        >
          🎳
        </div>

        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl text-white leading-none mb-2">
          <span
            className="inline-block"
            style={{
              background: "linear-gradient(135deg, #FFD700, #FF9F1C, #FFD700)",
              backgroundSize: "200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Moroni Family
          </span>
          <br />
          <span className="text-white">Bowling Scores</span>
        </h1>
        <p className="text-white/40 text-sm font-semibold uppercase tracking-[0.2em]">
          Reese · Brea · Kason · Whitley
        </p>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-16 space-y-8">
        {/* Leaderboard error */}
        {fetchError && (
          <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-sm px-4 py-3 font-semibold">
            ⚠️ {fetchError}
            <button
              onClick={fetchLeaderboard}
              className="ml-3 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Hero leaderboard */}
        <Leaderboard entries={leaderboard} loading={loading} />

        {/* Divider */}
        <div className="relative flex items-center gap-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-white/20 text-xl">🎳</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Score entry form */}
        <ScoreEntryForm onSuccess={handleScoreSuccess} />
      </main>

      {/* Footer */}
      <footer className="text-center pb-8 text-white/20 text-xs font-semibold uppercase tracking-widest">
        Strike after strike 🎳
      </footer>
    </div>
  );
}
