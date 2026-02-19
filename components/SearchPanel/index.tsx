"use client";

import { useState } from "react";

interface SearchPanelProps {
  onSearch: (keyword: string, maxResults: number) => void;
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

export default function SearchPanel({ onSearch, isLoading }: SearchPanelProps) {
  const [keyword, setKeyword] = useState("");
  const [maxResults, setMaxResults] = useState(20);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() || isLoading) return;
    onSearch(keyword.trim(), maxResults);
  };

  const handleQuickKeyword = (kw: string) => {
    setKeyword(kw);
    if (!isLoading) onSearch(kw, maxResults);
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
