import { createClient } from "@supabase/supabase-js";
import type { ScoreEntry, LeaderboardEntry, Bowler } from "./constants";
import { BOWLERS } from "./constants";

function getClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );
}

export async function appendScores(entries: ScoreEntry[]): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase.from("scores").insert(
    entries.map((e) => ({
      date: e.date,
      alley: e.alley,
      bowler: e.bowler,
      game_number: e.gameNumber,
      score: e.score,
    }))
  );
  if (error) throw error;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const supabase = getClient();
  const { data, error } = await supabase.from("scores").select("bowler, score");
  if (error) throw error;

  const scoresByBowler: Record<string, number[]> = Object.fromEntries(
    BOWLERS.map((b) => [b, []])
  );
  for (const row of data ?? []) {
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
