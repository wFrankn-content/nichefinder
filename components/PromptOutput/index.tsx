"use client";

import { useState } from "react";

interface PromptOutputProps {
  prompt: string;
  keyword: string;
}

export default function PromptOutput({ prompt, keyword }: PromptOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = prompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const charCount = prompt.length;
  const wordCount = prompt.split(/\s+/).filter(Boolean).length;

  return (
    <div className="bg-gaming-card border border-gaming-accent/40 rounded-xl overflow-hidden shadow-glow-purple">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gaming-border bg-gaming-accent/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-gaming-accent rounded-lg flex items-center justify-center shadow-glow-purple">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gaming-text">Generated AI Prompt</h3>
            <p className="text-xs text-gaming-muted">
              Ready to paste into Claude or ChatGPT for <span className="text-gaming-accent-light">{keyword}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex gap-3 text-xs text-gaming-muted">
            <span>{wordCount.toLocaleString()} words</span>
            <span>·</span>
            <span>{charCount.toLocaleString()} chars</span>
          </div>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
              copied
                ? "bg-gaming-success text-white scale-95"
                : "bg-gaming-accent hover:bg-gaming-accent-light text-white"
            }`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Prompt
              </>
            )}
          </button>
        </div>
      </div>

      {/* Instructions banner */}
      <div className="px-5 py-3 bg-gaming-surface/50 border-b border-gaming-border flex items-center gap-2 text-xs text-gaming-text-dim">
        <svg className="w-4 h-4 text-gaming-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Click <strong className="text-gaming-text mx-1">Copy Prompt</strong> above, then paste into
        <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="text-gaming-accent hover:underline mx-1">Claude.ai</a>
        or
        <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" className="text-gaming-accent hover:underline mx-1">ChatGPT</a>
        to get 10 viral video ideas instantly.
      </div>

      {/* Prompt text */}
      <div className="relative">
        <pre className="p-5 text-sm text-gaming-text-dim font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gaming-border scrollbar-track-transparent">
          {prompt}
        </pre>

        {/* Fade bottom */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gaming-card to-transparent" />
      </div>

      {/* Footer copy button */}
      <div className="px-5 py-4 border-t border-gaming-border flex items-center justify-between">
        <p className="text-xs text-gaming-muted">
          This prompt is optimized for gaming content strategy generation.
        </p>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
            copied
              ? "bg-gaming-success text-white"
              : "bg-gaming-surface border border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-white"
          }`}
        >
          {copied ? "Copied!" : "Copy to Clipboard"}
        </button>
      </div>
    </div>
  );
}
