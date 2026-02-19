import { NextRequest, NextResponse } from "next/server";
import { searchYouTube, SHORTS_MAX_SECONDS } from "@/lib/youtube";
import { analyzeVideos, buildPrompt } from "@/lib/analyzer";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { MOCK_VIDEOS } from "@/lib/mockData";
import { VideoFilter } from "@/types";

const isDemoMode = !process.env.YOUTUBE_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const keyword = (body.keyword ?? "").trim();
    const maxResults = Math.min(parseInt(body.maxResults ?? "20"), 50);
    const videoFilter: VideoFilter =
      body.videoFilter === "shorts" || body.videoFilter === "longform"
        ? body.videoFilter
        : "all";

    if (!keyword) {
      return NextResponse.json(
        { error: "keyword is required" },
        { status: 400 }
      );
    }

    // Use mock data when no API key is set, apply filter client-side
    let videos = isDemoMode
      ? MOCK_VIDEOS.slice(0, maxResults)
      : await searchYouTube(keyword, maxResults, videoFilter);

    // Apply duration filter to mock data (real data is filtered inside searchYouTube)
    if (isDemoMode && videoFilter !== "all") {
      videos =
        videoFilter === "shorts"
          ? videos.filter(
              (v) => (v.duration_seconds ?? 0) <= SHORTS_MAX_SECONDS
            )
          : videos.filter(
              (v) => (v.duration_seconds ?? 999) > SHORTS_MAX_SECONDS
            );
    }

    if (videos.length === 0) {
      return NextResponse.json(
        {
          error:
            videoFilter === "shorts"
              ? "No Shorts found for this keyword. Try increasing max results or switching to All."
              : videoFilter === "longform"
              ? "No long-form videos found for this keyword."
              : "No videos found for this keyword.",
        },
        { status: 404 }
      );
    }

    const analysis = analyzeVideos(videos);
    const promptText = buildPrompt(keyword, videos, analysis);

    let searchId = crypto.randomUUID();
    if (isSupabaseConfigured) {
      const { data: searchData, error: searchError } = await supabase
        .from("searches")
        .insert({ keyword })
        .select()
        .single();

      if (searchError) {
        console.error("Failed to save search:", searchError);
      }

      if (searchData?.id) {
        searchId = searchData.id;

        const videoRows = videos.map((v) => ({
          search_id: searchData.id,
          youtube_id: v.youtube_id,
          title: v.title,
          view_count: v.view_count,
          like_count: v.like_count,
          comment_count: v.comment_count,
          tags: v.tags,
          channel_name: v.channel_name,
          published_at: v.published_at,
          duration: v.duration ?? null,
          thumbnail_url: v.thumbnail_url ?? null,
        }));

        const { error: videoError } = await supabase
          .from("videos")
          .insert(videoRows);
        if (videoError) console.error("Failed to save videos:", videoError);

        const { error: promptError } = await supabase
          .from("generated_prompts")
          .insert({ search_id: searchData.id, prompt_text: promptText });
        if (promptError) console.error("Failed to save prompt:", promptError);
      }
    }

    return NextResponse.json({
      search_id: searchId,
      keyword,
      videos,
      analysis,
      prompt: promptText,
      demo: isDemoMode,
      videoFilter,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("YouTube API route error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
