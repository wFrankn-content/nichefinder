import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// GET /api/history — fetch all past searches with video counts
export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabase
    .from("searches")
    .select(
      `
      id,
      keyword,
      created_at,
      videos(count)
    `
    )
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const searches = (data ?? []).map((row) => ({
    id: row.id,
    keyword: row.keyword,
    created_at: row.created_at,
    video_count: Array.isArray(row.videos)
      ? (row.videos[0] as { count: number })?.count ?? 0
      : 0,
  }));

  return NextResponse.json(searches);
}
