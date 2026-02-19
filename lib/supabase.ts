import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export type Database = {
  public: {
    Tables: {
      searches: {
        Row: {
          id: string;
          keyword: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          keyword: string;
          created_at?: string;
        };
      };
      videos: {
        Row: {
          id: string;
          search_id: string;
          title: string;
          view_count: number;
          like_count: number;
          comment_count: number;
          tags: string[];
          channel_name: string;
          published_at: string;
          youtube_id: string;
          duration: string | null;
          thumbnail_url: string | null;
        };
        Insert: {
          id?: string;
          search_id: string;
          title: string;
          view_count: number;
          like_count: number;
          comment_count: number;
          tags: string[];
          channel_name: string;
          published_at: string;
          youtube_id: string;
          duration?: string | null;
          thumbnail_url?: string | null;
        };
      };
      generated_prompts: {
        Row: {
          id: string;
          search_id: string;
          prompt_text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          search_id: string;
          prompt_text: string;
          created_at?: string;
        };
      };
    };
  };
};
