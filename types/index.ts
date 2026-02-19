export type VideoFilter = "all" | "longform" | "shorts";

export interface VideoData {
  youtube_id: string;
  title: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  tags: string[];
  channel_name: string;
  published_at: string;
  duration?: string;
  duration_seconds?: number;
  thumbnail_url?: string;
  engagement_rate?: number;
}

export interface SearchRecord {
  id: string;
  keyword: string;
  created_at: string;
  video_count?: number;
}

export interface AnalysisResult {
  titleFormats: string[];
  powerWords: string[];
  avgEngagementRate: number;
  commonTags: string[];
  avgViewCount: number;
  topVideos: VideoData[];
}

export interface GeneratedPrompt {
  id?: string;
  search_id: string;
  prompt_text: string;
  created_at?: string;
}

export interface SearchResponse {
  search_id: string;
  keyword: string;
  videos: VideoData[];
  analysis: AnalysisResult;
  prompt: string;
  demo?: boolean;
  videoFilter?: VideoFilter;
}
