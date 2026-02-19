import { VideoData } from "@/types";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const API_KEY = process.env.YOUTUBE_API_KEY;

if (!API_KEY) {
  console.warn("YOUTUBE_API_KEY is not set in environment variables");
}

/** ISO 8601 duration (PT4M13S) → seconds */
export function parseDurationToSeconds(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const h = parseInt(match[1] ?? "0");
  const m = parseInt(match[2] ?? "0");
  const s = parseInt(match[3] ?? "0");
  return h * 3600 + m * 60 + s;
}

/** Returns a human-readable duration string, e.g. "12:34" */
function formatDuration(iso: string): string {
  const total = parseDurationToSeconds(iso);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Step 1 — search.list
 * Costs 100 units per call. Returns up to maxResults video IDs.
 * videoDuration: "short" (<4 min), "medium" (4-20 min), "long" (>20 min), or omit for all.
 */
async function searchVideoIds(
  keyword: string,
  maxResults = 20,
  videoDuration?: "short" | "medium" | "long"
): Promise<string[]> {
  // Filter to last 30 days so results reflect current trends, not all-time popularity
  const publishedAfter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const params = new URLSearchParams({
    part: "id",
    q: keyword,
    type: "video",
    order: "viewCount",
    videoCategoryId: "20", // Gaming category
    relevanceLanguage: "en",
    publishedAfter,
    maxResults: String(Math.min(maxResults, 50)),
    key: API_KEY!,
  });

  if (videoDuration) {
    params.set("videoDuration", videoDuration);
  }

  const res = await fetch(`${YOUTUBE_API_BASE}/search?${params}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      `YouTube search.list failed: ${error.error?.message ?? res.statusText}`
    );
  }

  const data = await res.json();
  return (data.items ?? []).map(
    (item: { id: { videoId: string } }) => item.id.videoId
  );
}

/**
 * Step 2 — videos.list
 * Costs 1 unit per call (regardless of id count). Returns full video details.
 */
async function fetchVideoDetails(videoIds: string[]): Promise<VideoData[]> {
  if (videoIds.length === 0) return [];

  const params = new URLSearchParams({
    part: "snippet,statistics,contentDetails",
    id: videoIds.join(","),
    key: API_KEY!,
  });

  const res = await fetch(`${YOUTUBE_API_BASE}/videos?${params}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      `YouTube videos.list failed: ${error.error?.message ?? res.statusText}`
    );
  }

  const data = await res.json();

  return (data.items ?? []).map(
    (item: {
      id: string;
      snippet: {
        title: string;
        channelTitle: string;
        publishedAt: string;
        tags?: string[];
        thumbnails?: { medium?: { url: string } };
      };
      statistics: {
        viewCount?: string;
        likeCount?: string;
        commentCount?: string;
      };
      contentDetails: { duration: string };
    }): VideoData => {
      const views = parseInt(item.statistics.viewCount ?? "0");
      const likes = parseInt(item.statistics.likeCount ?? "0");
      const comments = parseInt(item.statistics.commentCount ?? "0");
      const durationSecs = parseDurationToSeconds(item.contentDetails.duration);

      return {
        youtube_id: item.id,
        title: item.snippet.title,
        channel_name: item.snippet.channelTitle,
        published_at: item.snippet.publishedAt,
        tags: item.snippet.tags ?? [],
        view_count: views,
        like_count: likes,
        comment_count: comments,
        duration: formatDuration(item.contentDetails.duration),
        duration_seconds: durationSecs,
        thumbnail_url: item.snippet.thumbnails?.medium?.url ?? undefined,
        engagement_rate: views > 0 ? (likes / views) * 100 : 0,
      };
    }
  );
}

// Shorts are ≤ 3 minutes (YouTube's current Shorts limit)
export const SHORTS_MAX_SECONDS = 180;

/**
 * Main entry point — search YouTube for a keyword and return enriched video data.
 * Total quota cost: ~101 units per search (100 for search.list + 1 for videos.list).
 *
 * videoFilter: "all" | "shorts" | "longform"
 * - "shorts": pre-filters via API videoDuration=short (<4 min), then trims to ≤180s
 * - "longform": fetches all, trims to >180s client-side
 */
export async function searchYouTube(
  keyword: string,
  maxResults = 20,
  videoFilter: "all" | "shorts" | "longform" = "all"
): Promise<VideoData[]> {
  const apiDuration = videoFilter === "shorts" ? "short" : undefined;

  // Over-fetch when a filter is active so client-side trimming still yields maxResults
  const fetchCount = videoFilter === "all" ? maxResults : 50;

  const ids = await searchVideoIds(keyword, fetchCount, apiDuration);
  if (ids.length === 0) return [];

  const videos = await fetchVideoDetails(ids);

  const filtered =
    videoFilter === "shorts"
      ? videos.filter((v) => (v.duration_seconds ?? 0) <= SHORTS_MAX_SECONDS)
      : videoFilter === "longform"
      ? videos.filter((v) => (v.duration_seconds ?? 999) > SHORTS_MAX_SECONDS)
      : videos;

  return filtered.sort((a, b) => b.view_count - a.view_count).slice(0, maxResults);
}
