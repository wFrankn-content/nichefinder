import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { analyzeVideos, buildPrompt } from "@/lib/analyzer";
import { VideoData } from "@/types";

// POST /api/analyze — re-analyze a saved search by search_id
export async function POST(req: NextRequest) {
  try {
    const { search_id } = await req.json();

    if (!search_id) {
      return NextResponse.json(
        { error: "search_id is required" },
        { status: 400 }
      );
    }

    // Fetch search record
    const { data: searchData, error: searchError } = await supabase
      .from("searches")
      .select("*")
      .eq("id", search_id)
      .single();

    if (searchError || !searchData) {
      return NextResponse.json({ error: "Search not found" }, { status: 404 });
    }

    // Fetch videos for this search
    const { data: videoRows, error: videoError } = await supabase
      .from("videos")
      .select("*")
      .eq("search_id", search_id);

    if (videoError || !videoRows) {
      return NextResponse.json(
        { error: "No videos found for this search" },
        { status: 404 }
      );
    }

    const videos: VideoData[] = videoRows.map((v) => ({
      youtube_id: v.youtube_id,
      title: v.title,
      view_count: v.view_count,
      like_count: v.like_count,
      comment_count: v.comment_count,
      tags: v.tags ?? [],
      channel_name: v.channel_name,
      published_at: v.published_at,
      duration: v.duration ?? undefined,
      thumbnail_url: v.thumbnail_url ?? undefined,
      engagement_rate:
        v.view_count > 0 ? (v.like_count / v.view_count) * 100 : 0,
    }));

    const analysis = analyzeVideos(videos);
    const prompt = buildPrompt(searchData.keyword, videos, analysis);

    return NextResponse.json({
      search_id,
      keyword: searchData.keyword,
      videos,
      analysis,
      prompt,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
