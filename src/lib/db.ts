import type { ScoreEntry, LeaderboardEntry, Bowler } from "./constants";
import { BOWLERS } from "./constants";

function headers() {
  const key = process.env.SUPABASE_ANON_KEY!;
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

function url(path: string) {
  return `${process.env.SUPABASE_URL}/rest/v1/${path}`;
}

export async function appendScores(entries: ScoreEntry[]): Promise<void> {
  const res = await fetch(url("scores"), {
    method: "POST",
    headers: { ...headers(), Prefer: "return=minimal" },
    body: JSON.stringify(
      entries.map((e) => ({
        date: e.date,
        alley: e.alley,
        bowler: e.bowler,
        game_number: e.gameNumber,
        score: e.score,
      }))
    ),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase insert failed: ${text}`);
  }
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const res = await fetch(url("scores?select=bowler,score"), {
    headers: headers(),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase select failed: ${text}`);
  }

  const rows: { bowler: string; score: number }[] = await res.json();

  const scoresByBowler: Record<string, number[]> = Object.fromEntries(
    BOWLERS.map((b) => [b, []])
  );
  for (const row of rows) {
    scoresByBowler[row.bowler]?.push(row.score);
  }

  const entries: LeaderboardEntry[] = BOWLERS.map((bowler) => {
    const scores = scoresByBowler[bowler];
    const average =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;
    return {
      bowler: bowler as Bowler,
      highScore: scores.length > 0 ? Math.max(...scores) : 0,
      average,
      totalGames: scores.length,
      rank: 0,
    };
  });

  entries.sort((a, b) => b.average - a.average || b.highScore - a.highScore);
  entries.forEach((e, i) => (e.rank = i + 1));

  return entries;
}
