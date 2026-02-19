import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gaming: {
          bg: "#0a0a0f",
          surface: "#12121a",
          card: "#1a1a26",
          border: "#2a2a3a",
          accent: "#7c3aed",
          "accent-light": "#a855f7",
          "accent-glow": "#7c3aed33",
          success: "#10b981",
          warning: "#f59e0b",
          danger: "#ef4444",
          muted: "#6b7280",
          text: "#e2e8f0",
          "text-dim": "#94a3b8",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        "glow-purple": "0 0 20px #7c3aed33",
        "glow-purple-lg": "0 0 40px #7c3aed55",
      },
    },
  },
  plugins: [],
};
export default config;
