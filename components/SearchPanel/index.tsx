"use client";

import { useState } from "react";
import { VideoFilter } from "@/types";

interface SearchPanelProps {
  onSearch: (keyword: string, maxResults: number, videoFilter: VideoFilter) => void;
  isLoading: boolean;
}

const QUICK_KEYWORDS = [
  "Minecraft",
  "Fortnite",
  "Call of Duty",
  "Roblox",
  "GTA V",
  "Elden Ring",
  "Valorant",
  "Among Us",
];

const VIDEO_FILTERS: { value: VideoFilter; label: string; icon: string; desc: string }[] = [
  {
    value: "all",
    label: "All Videos",
    icon: "M4 6h16M4 12h16M4 18h16",
    desc: "Long-form and Shorts",
  },
  {
    value: "longform",
    label: "Long-form",
    icon: "M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z",
    desc: "> 3 minutes",
  },
  {
    value: "shorts",
    label: "Shorts",
    icon: "M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
    desc: "≤ 3 minutes",
  },
];

export default function SearchPanel({ onSearch, isLoading }: SearchPanelProps) {
  const [keyword, setKeyword] = useState("");
  const [maxResults, setMaxResults] = useState(20);
  const [videoFilter, setVideoFilter] = useState<VideoFilter>("all");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() || isLoading) return;
    onSearch(keyword.trim(), maxResults, videoFilter);
  };

  const handleQuickKeyword = (kw: string) => {
    setKeyword(kw);
    if (!isLoading) onSearch(kw, maxResults, videoFilter);
  };

  const handleFilterChange = (f: VideoFilter) => {
    setVideoFilter(f);
  };

  return (
    <div className="bg-gaming-card border border-gaming-border rounded-xl p-6 shadow-glow-purple">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 bg-gaming-accent rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gaming-text">Keyword Search</h2>
          <p className="text-xs text-gaming-muted">Find trending gaming videos on YouTube</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Search input row */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. Minecraft, Fortnite, Call of Duty..."
              className="w-full bg-gaming-surface border border-gaming-border rounded-lg px-4 py-3 text-gaming-text placeholder-gaming-muted focus:outline-none focus:border-gaming-accent focus:ring-1 focus:ring-gaming-accent transition-colors"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gaming-muted whitespace-nowrap">Max results</label>
            <select
              value={maxResults}
              onChange={(e) => setMaxResults(parseInt(e.target.value))}
              className="bg-gaming-surface border border-gaming-border rounded-lg px-3 py-3 text-gaming-text text-sm focus:outline-none focus:border-gaming-accent"
              disabled={isLoading}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!keyword.trim() || isLoading}
            className="px-6 py-3 bg-gaming-accent hover:bg-gaming-accent-light disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Searching...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </>
            )}
          </button>
        </div>

        {/* Video type toggle */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gaming-muted whitespace-nowrap">Video type:</span>
          <div className="flex gap-1 bg-gaming-surface border border-gaming-border rounded-lg p-1">
            {VIDEO_FILTERS.map((f) => {
              const active = videoFilter === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => handleFilterChange(f.value)}
                  disabled={isLoading}
                  title={f.desc}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                    active
                      ? "bg-gaming-accent text-white shadow-sm"
                      : "text-gaming-text-dim hover:text-gaming-text hover:bg-gaming-card"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} />
                  </svg>
                  {f.label}
                </button>
              );
            })}
          </div>
          <span className="text-xs text-gaming-muted">
            {videoFilter === "shorts"
              ? "Videos ≤ 3 min"
              : videoFilter === "longform"
              ? "Videos > 3 min"
              : "All durations"}
          </span>
        </div>

        {/* Quick-select keywords */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gaming-muted py-1">Quick select:</span>
          {QUICK_KEYWORDS.map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => handleQuickKeyword(kw)}
              disabled={isLoading}
              className="text-xs px-3 py-1 rounded-full border border-gaming-border text-gaming-text-dim hover:border-gaming-accent hover:text-gaming-accent-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {kw}
            </button>
          ))}
        </div>
      </form>

      <div className="mt-4 flex items-center gap-2 text-xs text-gaming-muted">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Each search uses ~101 YouTube API quota units. Daily limit: 10,000 units (~99 searches/day).
      </div>
    </div>
  );
}
