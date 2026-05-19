"use client";

import { LeaderboardEntry, BOWLER_CONFIG } from "@/lib/constants";

const RANK_MEDALS = ["🥇", "🥈", "🥉", "4️⃣"];
const RANK_LABELS = ["1st", "2nd", "3rd", "4th"];
const GLOW_CLASSES: Record<string, string> = {
  Reese: "glow-reese",
  Brea: "glow-brea",
  Kason: "glow-kason",
  Whitley: "glow-whitley",
};

interface Props {
  entries: LeaderboardEntry[];
  loading: boolean;
}

function ScoreBar({ value, max = 300 }: { value: number; max?: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${pct}%`,
          background: "linear-gradient(90deg, #FFD700, #FF9F1C)",
        }}
      />
    </div>
  );
}

function BowlerCard({ entry, isTop }: { entry: LeaderboardEntry; isTop: boolean }) {
  const cfg = BOWLER_CONFIG[entry.bowler];
  const medal = RANK_MEDALS[entry.rank - 1] ?? String(entry.rank);
  const glow = GLOW_CLASSES[entry.bowler] ?? "";

  return (
    <div
      className={`
        relative rounded-2xl p-4 border transition-all duration-300
        bg-gradient-to-br ${cfg.gradient}
        ${isTop ? `border-gold glow-gold scale-[1.02]` : "border-white/10 " + glow}
        ${entry.totalGames === 0 ? "opacity-70" : ""}
      `}
      style={{ background: `linear-gradient(135deg, ${cfg.color}22 0%, #1a1a3e 100%)` }}
    >
      {/* Rank badge */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl leading-none">{medal}</span>
        <span className="text-3xl leading-none">{cfg.emoji}</span>
      </div>

      {/* Name */}
      <h3
        className="font-display text-2xl leading-none mb-1"
        style={{ color: cfg.color }}
      >
        {entry.bowler}
      </h3>
      <p className="text-xs text-white/50 mb-3 font-semibold uppercase tracking-widest">
        {RANK_LABELS[entry.rank - 1]}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center">
          <p className="text-[10px] text-white/50 uppercase tracking-wider">High</p>
          <p className="font-display text-lg leading-tight" style={{ color: cfg.color }}>
            {entry.highScore || "—"}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-white/50 uppercase tracking-wider">Avg</p>
          <p className="font-display text-lg leading-tight text-gold">
            {entry.average || "—"}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-white/50 uppercase tracking-wider">Games</p>
          <p className="font-display text-lg leading-tight text-white">
            {entry.totalGames}
          </p>
        </div>
      </div>

      {/* Average bar */}
      <ScoreBar value={entry.average} />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl p-4 border border-white/10 bg-lane-card animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="w-8 h-8 bg-white/10 rounded" />
        <div className="w-8 h-8 bg-white/10 rounded" />
      </div>
      <div className="h-6 bg-white/10 rounded w-24 mb-1" />
      <div className="h-3 bg-white/10 rounded w-12 mb-3" />
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-10 bg-white/10 rounded" />
        ))}
      </div>
      <div className="h-2 bg-white/10 rounded" />
    </div>
  );
}

export default function Leaderboard({ entries, loading }: Props) {
  const sorted = [...entries].sort((a, b) => a.rank - b.rank);

  return (
    <section className="mb-8">
      {/* Section header */}
      <div className="text-center mb-6">
        <h2 className="font-display text-4xl sm:text-5xl text-white mb-1">
          🏆 Leaderboard
        </h2>
        <p className="text-white/40 text-sm font-semibold uppercase tracking-widest">
          Who&apos;s ruling the lanes?
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading
          ? [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)
          : sorted.map((entry) => (
              <BowlerCard key={entry.bowler} entry={entry} isTop={entry.rank === 1} />
            ))}
      </div>

      {!loading && entries.every((e) => e.totalGames === 0) && (
        <p className="text-center text-white/40 text-sm mt-4">
          No scores yet — log your first session below! 👇
        </p>
      )}
    </section>
  );
}
