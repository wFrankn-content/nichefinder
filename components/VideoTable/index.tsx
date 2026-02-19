"use client";

import { useState, useMemo } from "react";
import { VideoData } from "@/types";

interface VideoTableProps {
  videos: VideoData[];
}

type SortKey = "view_count" | "like_count" | "comment_count" | "engagement_rate" | "published_at";
type SortDir = "asc" | "desc";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return (
    <svg className="w-3 h-3 text-gaming-muted opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );
  return dir === "desc" ? (
    <svg className="w-3 h-3 text-gaming-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ) : (
    <svg className="w-3 h-3 text-gaming-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  );
}

export default function VideoTable({ videos }: VideoTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("view_count");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const sorted = useMemo(() => {
    return [...videos].sort((a, b) => {
      let aVal: number | string = a[sortKey] ?? 0;
      let bVal: number | string = b[sortKey] ?? 0;
      if (sortKey === "published_at") {
        aVal = new Date(a.published_at).getTime();
        bVal = new Date(b.published_at).getTime();
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [videos, sortKey, sortDir]);

  const paginated = sorted.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(videos.length / pageSize);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(0);
  };

  const cols: { key: SortKey; label: string; align?: string }[] = [
    { key: "view_count", label: "Views", align: "right" },
    { key: "like_count", label: "Likes", align: "right" },
    { key: "comment_count", label: "Comments", align: "right" },
    { key: "engagement_rate", label: "Engagement", align: "right" },
    { key: "published_at", label: "Published", align: "right" },
  ];

  return (
    <div className="bg-gaming-card border border-gaming-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gaming-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-gaming-accent/20 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-gaming-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gaming-text">Video Results</h3>
        </div>
        <span className="text-xs text-gaming-muted bg-gaming-surface px-2.5 py-1 rounded-full">
          {videos.length} videos
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gaming-border bg-gaming-surface/50">
              <th className="text-left px-4 py-3 text-gaming-muted font-medium w-12">#</th>
              <th className="text-left px-4 py-3 text-gaming-muted font-medium">Title</th>
              <th className="text-left px-4 py-3 text-gaming-muted font-medium">Channel</th>
              {cols.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-gaming-muted font-medium cursor-pointer hover:text-gaming-text select-none"
                  onClick={() => handleSort(col.key)}
                >
                  <div className={`flex items-center gap-1 ${col.align === "right" ? "justify-end" : ""}`}>
                    <span>{col.label}</span>
                    <SortIcon active={sortKey === col.key} dir={sortDir} />
                  </div>
                </th>
              ))}
              <th className="text-right px-4 py-3 text-gaming-muted font-medium">Duration</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((video, idx) => {
              const globalIdx = page * pageSize + idx + 1;
              const engRate = video.engagement_rate?.toFixed(2) ?? "0.00";
              const isTopTen = globalIdx <= 10;

              return (
                <tr
                  key={video.youtube_id}
                  className="border-b border-gaming-border/50 hover:bg-gaming-surface/30 transition-colors group"
                >
                  <td className="px-4 py-3 text-gaming-muted text-xs font-mono">
                    {isTopTen && globalIdx <= 3 ? (
                      <span className={`font-bold ${globalIdx === 1 ? "text-yellow-400" : globalIdx === 2 ? "text-gray-300" : "text-orange-400"}`}>
                        #{globalIdx}
                      </span>
                    ) : (
                      <span>#{globalIdx}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <a
                      href={`https://youtube.com/watch?v=${video.youtube_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gaming-text hover:text-gaming-accent-light line-clamp-2 transition-colors font-medium"
                      title={video.title}
                    >
                      {video.title}
                    </a>
                    {video.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {video.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs px-1.5 py-0.5 bg-gaming-surface text-gaming-muted rounded">
                            {tag}
                          </span>
                        ))}
                        {video.tags.length > 3 && (
                          <span className="text-xs text-gaming-muted">+{video.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gaming-text-dim text-xs whitespace-nowrap">
                    {video.channel_name}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-gaming-text font-mono font-medium">
                      {formatNumber(video.view_count)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-gaming-success font-mono text-xs">
                      {formatNumber(video.like_count)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-gaming-text-dim font-mono text-xs">
                      {formatNumber(video.comment_count)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-mono text-xs font-medium px-2 py-0.5 rounded ${
                      parseFloat(engRate) >= 5
                        ? "text-gaming-success bg-gaming-success/10"
                        : parseFloat(engRate) >= 2
                        ? "text-gaming-warning bg-gaming-warning/10"
                        : "text-gaming-muted bg-gaming-surface"
                    }`}>
                      {engRate}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gaming-text-dim text-xs whitespace-nowrap">
                    {new Date(video.published_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right text-gaming-muted text-xs font-mono whitespace-nowrap">
                    {video.duration ?? "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-gaming-border flex items-center justify-between">
          <span className="text-xs text-gaming-muted">
            Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, videos.length)} of {videos.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
              className="px-3 py-1.5 text-xs bg-gaming-surface border border-gaming-border rounded-lg text-gaming-text disabled:opacity-30 hover:border-gaming-accent transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              disabled={page === totalPages - 1}
              className="px-3 py-1.5 text-xs bg-gaming-surface border border-gaming-border rounded-lg text-gaming-text disabled:opacity-30 hover:border-gaming-accent transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
