"use client";

import { useState } from "react";
import SearchPanel from "@/components/SearchPanel";
import VideoTable from "@/components/VideoTable";
import PatternSummary from "@/components/PatternSummary";
import PromptOutput from "@/components/PromptOutput";
import { SearchResponse } from "@/types";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResponse | null>(null);

  const handleSearch = async (keyword: string, maxResults: number) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, maxResults }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      const data: SearchResponse = await res.json();
      setResult(data);

      // Scroll to results
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gaming-text">Research Dashboard</h1>
        <p className="text-gaming-text-dim text-sm mt-1">
          Search any gaming keyword to analyze trends and generate your AI prompt.
        </p>
      </div>

      {/* Search */}
      <SearchPanel onSearch={handleSearch} isLoading={isLoading} />

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gaming-border rounded-full animate-spin border-t-gaming-accent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-gaming-accent/20 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-gaming-text font-medium">Fetching YouTube data...</p>
            <p className="text-gaming-muted text-sm">Searching and analyzing up to 50 videos</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-gaming-danger/10 border border-gaming-danger/30 rounded-xl p-5 flex items-start gap-3">
          <svg className="w-5 h-5 text-gaming-danger shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-gaming-danger font-semibold text-sm">Search failed</p>
            <p className="text-gaming-text-dim text-sm mt-1">{error}</p>
            {error.includes("quota") && (
              <p className="text-xs text-gaming-muted mt-2">
                YouTube API quota exceeded. Resets daily at midnight Pacific Time.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div id="results" className="space-y-6">
          {/* Demo mode banner */}
          {result.demo && (
            <div className="bg-gaming-warning/10 border border-gaming-warning/30 rounded-xl px-5 py-3 flex items-center gap-3 text-sm">
              <svg className="w-4 h-4 text-gaming-warning shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gaming-warning font-medium">Demo mode</span>
              <span className="text-gaming-text-dim">
                — showing sample Minecraft data. Add your <code className="text-gaming-text bg-gaming-surface px-1 rounded">YOUTUBE_API_KEY</code> to <code className="text-gaming-text bg-gaming-surface px-1 rounded">.env.local</code> for live results.
              </span>
            </div>
          )}

          {/* Result summary header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gaming-text">
                Results for{" "}
                <span className="text-gaming-accent-light">"{result.keyword}"</span>
              </h2>
              <p className="text-gaming-muted text-sm mt-0.5">
                Found {result.videos.length} videos
                {!result.demo && " · Saved to history"}
              </p>
            </div>
            {!result.demo && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-gaming-muted">
                <div className="w-2 h-2 bg-gaming-success rounded-full animate-pulse" />
                Saved to Supabase
              </div>
            )}
          </div>

          {/* Pattern analysis */}
          <PatternSummary analysis={result.analysis} keyword={result.keyword} />

          {/* Video table */}
          <VideoTable videos={result.videos} />

          {/* AI Prompt */}
          <PromptOutput prompt={result.prompt} keyword={result.keyword} />
        </div>
      )}

      {/* Empty state (no search yet) */}
      {!result && !isLoading && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
          <div className="w-16 h-16 bg-gaming-card border border-gaming-border rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-gaming-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-gaming-text font-medium">Ready to research</p>
          <p className="text-gaming-muted text-sm max-w-sm">
            Enter a gaming keyword above or click a quick-select tag to find trending videos and generate your AI prompt.
          </p>
        </div>
      )}
    </div>
  );
}
