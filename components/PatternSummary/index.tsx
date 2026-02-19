"use client";

import { AnalysisResult } from "@/types";

interface PatternSummaryProps {
  analysis: AnalysisResult;
  keyword: string;
}

function StatCard({
  label,
  value,
  sub,
  color = "purple",
}: {
  label: string;
  value: string;
  sub?: string;
  color?: "purple" | "green" | "yellow" | "blue";
}) {
  const colorMap = {
    purple: "text-gaming-accent border-gaming-accent/30 bg-gaming-accent/5",
    green: "text-gaming-success border-gaming-success/30 bg-gaming-success/5",
    yellow: "text-gaming-warning border-gaming-warning/30 bg-gaming-warning/5",
    blue: "text-blue-400 border-blue-400/30 bg-blue-400/5",
  };

  return (
    <div className={`border rounded-xl p-4 ${colorMap[color]}`}>
      <div className="text-2xl font-bold font-mono">{value}</div>
      <div className="text-xs text-gaming-muted mt-0.5 uppercase tracking-wide">{label}</div>
      {sub && <div className="text-xs text-gaming-text-dim mt-1">{sub}</div>}
    </div>
  );
}

function Tag({ text, variant = "default" }: { text: string; variant?: "power" | "tag" | "format" | "default" }) {
  const base = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium";
  const variants = {
    power: `${base} bg-gaming-accent/15 text-gaming-accent-light border border-gaming-accent/20`,
    tag: `${base} bg-gaming-surface text-gaming-text-dim border border-gaming-border`,
    format: `${base} bg-gaming-success/10 text-gaming-success border border-gaming-success/20`,
    default: `${base} bg-gaming-surface text-gaming-text-dim`,
  };
  return <span className={variants[variant]}>{text}</span>;
}

export default function PatternSummary({ analysis, keyword }: PatternSummaryProps) {
  return (
    <div className="bg-gaming-card border border-gaming-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gaming-border flex items-center gap-3">
        <div className="w-7 h-7 bg-gaming-success/20 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-gaming-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-gaming-text">Pattern Analysis</h3>
          <p className="text-xs text-gaming-muted">
            Trends detected in top {analysis.topVideos.length} videos for <span className="text-gaming-accent-light">{keyword}</span>
          </p>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Avg Views"
            value={analysis.avgViewCount >= 1_000_000
              ? `${(analysis.avgViewCount / 1_000_000).toFixed(1)}M`
              : analysis.avgViewCount >= 1_000
              ? `${(analysis.avgViewCount / 1_000).toFixed(0)}K`
              : analysis.avgViewCount.toString()}
            color="blue"
          />
          <StatCard
            label="Avg Engagement"
            value={`${analysis.avgEngagementRate}%`}
            sub={analysis.avgEngagementRate >= 5 ? "High" : analysis.avgEngagementRate >= 2 ? "Average" : "Low"}
            color={analysis.avgEngagementRate >= 5 ? "green" : analysis.avgEngagementRate >= 2 ? "yellow" : "purple"}
          />
          <StatCard
            label="Power Words Found"
            value={analysis.powerWords.length.toString()}
            color="purple"
          />
          <StatCard
            label="Common Tags"
            value={analysis.commonTags.length.toString()}
            color="green"
          />
        </div>

        {/* Title Formats */}
        {analysis.titleFormats.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gaming-muted uppercase tracking-wider mb-2.5">
              Title Formats Detected
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.titleFormats.map((fmt) => (
                <Tag key={fmt} text={fmt} variant="format" />
              ))}
            </div>
          </div>
        )}

        {/* Power Words */}
        {analysis.powerWords.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gaming-muted uppercase tracking-wider mb-2.5">
              Power Words in Titles
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.powerWords.map((word) => (
                <Tag key={word} text={word} variant="power" />
              ))}
            </div>
          </div>
        )}

        {/* Common Tags */}
        {analysis.commonTags.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gaming-muted uppercase tracking-wider mb-2.5">
              Most Common Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.commonTags.map((tag) => (
                <Tag key={tag} text={tag} variant="tag" />
              ))}
            </div>
          </div>
        )}

        {/* Top video mini-list */}
        {analysis.topVideos.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gaming-muted uppercase tracking-wider mb-2.5">
              Top 3 Performing Videos
            </h4>
            <div className="space-y-2">
              {analysis.topVideos.slice(0, 3).map((v, i) => (
                <div key={v.youtube_id} className="flex items-start gap-3 p-3 bg-gaming-surface rounded-lg">
                  <span className={`text-xs font-bold font-mono mt-0.5 ${i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : "text-orange-400"}`}>
                    #{i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gaming-text truncate">{v.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gaming-muted">
                      <span>{v.view_count >= 1_000_000 ? `${(v.view_count / 1_000_000).toFixed(1)}M` : `${(v.view_count / 1_000).toFixed(0)}K`} views</span>
                      <span>{(v.engagement_rate ?? 0).toFixed(2)}% engagement</span>
                      <span className="truncate">{v.channel_name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
