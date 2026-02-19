"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SearchRecord } from "@/types";

export default function HistoryPage() {
  const [searches, setSearches] = useState<SearchRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/history");
        if (!res.ok) throw new Error("Failed to load history");
        const data = await res.json();
        setSearches(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gaming-text">Search History</h1>
          <p className="text-gaming-text-dim text-sm mt-1">
            Past research sessions saved to Supabase
          </p>
        </div>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-gaming-accent hover:bg-gaming-accent-light text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Search
        </Link>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-gaming-border rounded-full animate-spin border-t-gaming-accent" />
        </div>
      )}

      {error && (
        <div className="bg-gaming-danger/10 border border-gaming-danger/30 rounded-xl p-5 text-gaming-danger text-sm">
          {error}
          {error.includes("Supabase") || error.includes("Failed") ? (
            <p className="text-gaming-muted text-xs mt-2">
              Make sure your Supabase environment variables are configured and the database schema has been applied.
            </p>
          ) : null}
        </div>
      )}

      {!isLoading && !error && searches.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
          <div className="w-16 h-16 bg-gaming-card border border-gaming-border rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-gaming-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gaming-text font-medium">No searches yet</p>
          <p className="text-gaming-muted text-sm">
            Your research history will appear here after your first search.
          </p>
          <Link
            href="/dashboard"
            className="mt-2 px-5 py-2 bg-gaming-accent text-white text-sm font-semibold rounded-lg hover:bg-gaming-accent-light transition-colors"
          >
            Start Researching
          </Link>
        </div>
      )}

      {!isLoading && searches.length > 0 && (
        <div className="bg-gaming-card border border-gaming-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gaming-border bg-gaming-surface/50 flex items-center gap-2">
            <svg className="w-4 h-4 text-gaming-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gaming-muted">{searches.length} saved searches</span>
          </div>

          <div className="divide-y divide-gaming-border/50">
            {searches.map((search) => (
              <div
                key={search.id}
                className="px-5 py-4 flex items-center justify-between hover:bg-gaming-surface/30 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-gaming-accent/10 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-gaming-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gaming-text group-hover:text-gaming-accent-light transition-colors">
                      {search.keyword}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gaming-muted">
                      {search.video_count !== undefined && (
                        <span>{search.video_count} videos</span>
                      )}
                      <span>·</span>
                      <span>{timeAgo(search.created_at)}</span>
                      <span className="hidden sm:inline">·</span>
                      <span className="hidden sm:inline">
                        {new Date(search.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard?keyword=${encodeURIComponent(search.keyword)}`}
                    className="px-3 py-1.5 text-xs bg-gaming-surface border border-gaming-border rounded-lg text-gaming-text-dim hover:border-gaming-accent hover:text-gaming-accent transition-colors"
                  >
                    Re-search
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
