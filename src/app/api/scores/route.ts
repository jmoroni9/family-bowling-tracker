import { NextRequest, NextResponse } from "next/server";
import { appendScores } from "@/lib/db";
import { BOWLERS, ALLEYS } from "@/lib/constants";
import type { ScoreEntry } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, alley, scores } = body as {
      date: string;
      alley: string;
      scores: { bowler: string; gameNumber: number; score: number }[];
    };

    if (!date || !alley || !Array.isArray(scores) || scores.length === 0) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (!ALLEYS.includes(alley as (typeof ALLEYS)[number])) {
      return NextResponse.json({ error: "Invalid bowling alley." }, { status: 400 });
    }

    const entries: ScoreEntry[] = [];
    for (const s of scores) {
      if (!BOWLERS.includes(s.bowler as (typeof BOWLERS)[number])) continue;
      const score = Number(s.score);
      if (isNaN(score) || score < 0 || score > 300) continue;
      entries.push({ date, alley, bowler: s.bowler, gameNumber: s.gameNumber, score });
    }

    if (entries.length === 0) {
      return NextResponse.json({ error: "No valid scores provided." }, { status: 400 });
    }

    await appendScores(entries);
    return NextResponse.json({ success: true, saved: entries.length });
  } catch (err) {
    console.error("Score submission failed:", err);
    return NextResponse.json(
      { error: "Failed to save scores. Check your Supabase credentials." },
      { status: 500 }
    );
  }
}
