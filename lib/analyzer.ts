import { VideoData, AnalysisResult } from "@/types";

// Power words commonly found in viral gaming video titles
const POWER_WORD_LIST = [
  "hardest",
  "impossible",
  "insane",
  "crazy",
  "challenge",
  "every",
  "giant",
  "world",
  "record",
  "best",
  "worst",
  "secret",
  "hidden",
  "never",
  "always",
  "only",
  "first",
  "last",
  "new",
  "real",
  "fake",
  "ultimate",
  "legendary",
  "epic",
  "overpowered",
  "broken",
  "banned",
  "deleted",
  "exposed",
  "destroying",
  "beating",
  "winning",
  "losing",
  "surviving",
  "100",
  "1000",
  "solo",
  "noob",
  "pro",
  "god",
  "hacked",
  "glitch",
  "op",
  "ranked",
  "undefeated",
  "speedrun",
  "hardcore",
];

// Common viral title format patterns
const TITLE_FORMAT_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /i (did|spent|played|tried|survived|beat)/i, label: "I Did/Spent/Played X" },
  { pattern: /\d+ days?/i, label: "X Days Challenge" },
  { pattern: /\d+ hours?/i, label: "X Hours Challenge" },
  { pattern: /\d+ kills?/i, label: "X Kills" },
  { pattern: /\d+ wins?/i, label: "X Wins" },
  { pattern: /but (every|each|all)/i, label: "X but Every Y" },
  { pattern: /vs\.?/i, label: "X vs Y" },
  { pattern: /\*.*\*/i, label: "*(Asterisk/Emphasis) Title" },
  { pattern: /\(.*\)/i, label: "Title (Parenthetical)" },
  { pattern: /how (to|i)/i, label: "How To/How I" },
  { pattern: /world('s)? (first|best|worst|hardest)/i, label: "World's First/Best/Worst" },
  { pattern: /only (using|with|a)/i, label: "Only Using X" },
  { pattern: /challenge/i, label: "Challenge Format" },
  { pattern: /pro vs (noob|beginner)/i, label: "Pro vs Noob" },
  { pattern: /\d+/i, label: "Contains Number" },
  { pattern: /^(the|a) /i, label: "Article Start (The/A)" },
  { pattern: /react(ing|ed|ion)/i, label: "Reaction Video" },
  { pattern: /tier list/i, label: "Tier List" },
  { pattern: /best .+ in/i, label: "Best X in Y" },
  { pattern: /i got/i, label: "I Got X" },
];

function extractPowerWords(titles: string[]): string[] {
  const wordFrequency: Record<string, number> = {};

  titles.forEach((title) => {
    const lower = title.toLowerCase();
    POWER_WORD_LIST.forEach((word) => {
      if (lower.includes(word)) {
        wordFrequency[word] = (wordFrequency[word] ?? 0) + 1;
      }
    });
  });

  return Object.entries(wordFrequency)
    .filter(([, count]) => count >= 1)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
}

function extractTitleFormats(titles: string[]): string[] {
  const formatFrequency: Record<string, number> = {};

  titles.forEach((title) => {
    TITLE_FORMAT_PATTERNS.forEach(({ pattern, label }) => {
      if (pattern.test(title)) {
        formatFrequency[label] = (formatFrequency[label] ?? 0) + 1;
      }
    });
  });

  return Object.entries(formatFrequency)
    .filter(([, count]) => count >= 2)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([label, count]) => `${label} (${count} videos)`);
}

function extractCommonTags(videos: VideoData[]): string[] {
  const tagFrequency: Record<string, number> = {};

  videos.forEach((video) => {
    video.tags.forEach((tag) => {
      const normalized = tag.toLowerCase().trim();
      if (normalized.length > 2) {
        tagFrequency[normalized] = (tagFrequency[normalized] ?? 0) + 1;
      }
    });
  });

  return Object.entries(tagFrequency)
    .filter(([, count]) => count >= 2)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
    .map(([tag]) => tag);
}

export function analyzeVideos(videos: VideoData[]): AnalysisResult {
  if (videos.length === 0) {
    return {
      titleFormats: [],
      powerWords: [],
      avgEngagementRate: 0,
      commonTags: [],
      avgViewCount: 0,
      topVideos: [],
    };
  }

  const titles = videos.map((v) => v.title);

  const totalEngagement = videos.reduce(
    (sum, v) => sum + (v.engagement_rate ?? 0),
    0
  );
  const avgEngagementRate = totalEngagement / videos.length;

  const totalViews = videos.reduce((sum, v) => sum + v.view_count, 0);
  const avgViewCount = Math.round(totalViews / videos.length);

  return {
    titleFormats: extractTitleFormats(titles),
    powerWords: extractPowerWords(titles),
    avgEngagementRate: Math.round(avgEngagementRate * 100) / 100,
    commonTags: extractCommonTags(videos),
    avgViewCount,
    topVideos: videos.slice(0, 10),
  };
}

export function buildPrompt(
  keyword: string,
  videos: VideoData[],
  analysis: AnalysisResult
): string {
  const top10 = videos.slice(0, 10);

  const videoList = top10
    .map((v, i) => {
      const engRate =
        v.engagement_rate !== undefined
          ? v.engagement_rate.toFixed(2)
          : "0.00";
      const views = v.view_count.toLocaleString();
      const likes = v.like_count.toLocaleString();
      return `${i + 1}. "${v.title}"
   - Channel: ${v.channel_name}
   - Views: ${views} | Likes: ${likes} | Engagement: ${engRate}%
   - Published: ${new Date(v.published_at).toLocaleDateString()}`;
    })
    .join("\n\n");

  const titleFormats =
    analysis.titleFormats.length > 0
      ? analysis.titleFormats.join(", ")
      : "No clear format pattern";

  const powerWords =
    analysis.powerWords.length > 0
      ? analysis.powerWords.join(", ")
      : "None detected";

  const commonTags =
    analysis.commonTags.length > 0
      ? analysis.commonTags.slice(0, 10).join(", ")
      : "No common tags";

  return `You are a YouTube content strategist specializing in gaming content.

I researched the top trending videos for the keyword: ${keyword}

Here is the data:

${videoList}

Patterns I noticed:
- Title formats: ${titleFormats}
- Power words: ${powerWords}
- Avg engagement rate: ${analysis.avgEngagementRate}%
- Avg view count: ${analysis.avgViewCount.toLocaleString()}
- Most common tags: ${commonTags}

Based on this data, generate 10 viral video ideas for the ${keyword} niche.

For each idea provide:
1. Video title
2. Opening hook (first 15 seconds)
3. Thumbnail concept
4. 2-3 sentence video description`;
}
