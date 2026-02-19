import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "NicheScout — Gaming YouTube Research Tool",
  description:
    "Research trending gaming YouTube videos, analyze patterns, and generate viral content prompts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gaming-bg text-gaming-text antialiased">
        {/* Nav */}
        <nav className="sticky top-0 z-50 bg-gaming-surface/80 backdrop-blur-md border-b border-gaming-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 bg-gaming-accent rounded-lg flex items-center justify-center shadow-glow-purple group-hover:shadow-glow-purple-lg transition-shadow">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-bold text-gaming-text tracking-tight">
                Niche<span className="text-gaming-accent-light">Scout</span>
              </span>
            </Link>

            <div className="flex items-center gap-1">
              <Link
                href="/"
                className="px-3 py-1.5 text-sm text-gaming-text-dim hover:text-gaming-text hover:bg-gaming-card rounded-lg transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/history"
                className="px-3 py-1.5 text-sm text-gaming-text-dim hover:text-gaming-text hover:bg-gaming-card rounded-lg transition-colors"
              >
                History
              </Link>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
