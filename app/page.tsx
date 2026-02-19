import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
      {/* Hero */}
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gaming-accent/10 border border-gaming-accent/20 rounded-full text-xs text-gaming-accent-light mb-2">
          <span className="w-1.5 h-1.5 bg-gaming-accent rounded-full animate-pulse" />
          Gaming YouTube Research Tool
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-gaming-text leading-tight">
          Find Viral Gaming Videos,{" "}
          <span className="text-gaming-accent-light">Generate AI Prompts</span>
        </h1>

        <p className="text-gaming-text-dim text-lg leading-relaxed">
          Research trending YouTube videos in any gaming niche, analyze title patterns and
          engagement, then generate a ready-to-paste AI prompt to brainstorm your next viral video.
        </p>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/dashboard"
          className="px-8 py-3 bg-gaming-accent hover:bg-gaming-accent-light text-white font-semibold rounded-xl transition-colors shadow-glow-purple hover:shadow-glow-purple-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Start Researching
        </Link>
        <Link
          href="/history"
          className="px-8 py-3 bg-gaming-card border border-gaming-border hover:border-gaming-accent text-gaming-text font-semibold rounded-xl transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          View History
        </Link>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 max-w-3xl w-full text-left">
        {[
          {
            icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
            title: "Keyword Search",
            desc: "Search top trending gaming videos by keyword — up to 50 results per query.",
          },
          {
            icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
            title: "Pattern Analysis",
            desc: "Auto-detect title formats, power words, engagement rates, and common tags.",
          },
          {
            icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
            title: "AI Prompt Generator",
            desc: "One-click copy of a structured prompt for Claude or ChatGPT — no API costs.",
          },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="bg-gaming-card border border-gaming-border rounded-xl p-4 space-y-2">
            <div className="w-8 h-8 bg-gaming-accent/15 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-gaming-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
              </svg>
            </div>
            <h3 className="font-semibold text-gaming-text text-sm">{title}</h3>
            <p className="text-xs text-gaming-text-dim leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
