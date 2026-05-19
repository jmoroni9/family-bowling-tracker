// Shared constants and types — safe to import from client components

export const BOWLERS = ["Reese", "Brea", "Kason", "Whitley"] as const;
export type Bowler = (typeof BOWLERS)[number];

export const ALLEYS = [
  "Cave Spring Lanes",
  "St. Charles Lanes",
  "Harvest Lanes",
] as const;

export const BOWLER_CONFIG: Record<
  Bowler,
  { color: string; bgClass: string; ringClass: string; emoji: string; gradient: string }
> = {
  Reese: {
    color: "#FF6B6B",
    bgClass: "bg-reese",
    ringClass: "ring-reese",
    emoji: "🎳",
    gradient: "from-reese/30 to-reese/5",
  },
  Brea: {
    color: "#DA77F2",
    bgClass: "bg-brea",
    ringClass: "ring-brea",
    emoji: "🦋",
    gradient: "from-brea/30 to-brea/5",
  },
  Kason: {
    color: "#FFB347",
    bgClass: "bg-kason",
    ringClass: "ring-kason",
    emoji: "⚡",
    gradient: "from-kason/30 to-kason/5",
  },
  Whitley: {
    color: "#3ECFCF",
    bgClass: "bg-whitley",
    ringClass: "ring-whitley",
    emoji: "🌟",
    gradient: "from-whitley/30 to-whitley/5",
  },
};

export interface ScoreEntry {
  date: string;
  alley: string;
  bowler: string;
  gameNumber: number;
  score: number;
}

export interface LeaderboardEntry {
  bowler: Bowler;
  highScore: number;
  average: number;
  totalGames: number;
  rank: number;
}
