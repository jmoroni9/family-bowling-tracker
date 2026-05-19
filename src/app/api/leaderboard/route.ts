import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const leaderboard = await getLeaderboard();
    return NextResponse.json({ leaderboard });
  } catch (err) {
    console.error("Leaderboard fetch failed:", err);
    return NextResponse.json(
      { error: "Failed to load leaderboard. Check your Supabase credentials." },
      { status: 500 }
    );
  }
}
