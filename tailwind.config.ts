import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", lg: "2rem" },
      screens: { "2xl": "1320px" },
    },
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        bg: {
          0: "#07070b",
          1: "#0e0e14",
          2: "#14141d",
          3: "#1a1a26",
          4: "#22222f",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.08)",
          strong: "rgba(255,255,255,0.16)",
        },
        text: {
          DEFAULT: "#f6f6f8",
          muted: "#9090a0",
          dim: "#5a5a6b",
        },
        brand: {
          indigo: "#6366f1",
          violet: "#8b5cf6",
          fuchsia: "#d946ef",
          rose: "#f43f5e",
          sky: "#38bdf8",
          emerald: "#34d399",
          amber: "#fbbf24",
        },
      },
      backgroundImage: {
        "grad-aurora":
          "linear-gradient(135deg, #6366f1 0%, #8b5cf6 35%, #d946ef 75%, #f43f5e 100%)",
        "grad-emerald":
          "linear-gradient(135deg, #34d399 0%, #38bdf8 100%)",
        "noise":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E\")",
      },
      animation: {
        "shimmer": "shimmer 2.5s linear infinite",
        "ping-slow": "ping-slow 2s cubic-bezier(0,0,0.2,1) infinite",
        "float": "float 6s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "ping-slow": {
          "0%,100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.4)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      typography: () => ({
        invert: {
          css: {
            "--tw-prose-body": "#cfcfd9",
            "--tw-prose-headings": "#f6f6f8",
            "--tw-prose-lead": "#9090a0",
            "--tw-prose-links": "#a5b4fc",
            "--tw-prose-bold": "#f6f6f8",
            "--tw-prose-counters": "#9090a0",
            "--tw-prose-bullets": "#5a5a6b",
            "--tw-prose-hr": "rgba(255,255,255,0.08)",
            "--tw-prose-quotes": "#cfcfd9",
            "--tw-prose-quote-borders": "#6366f1",
            "--tw-prose-code": "#c7d2fe",
            "--tw-prose-pre-code": "#cfcfd9",
            "--tw-prose-pre-bg": "#0e0e14",
            "--tw-prose-th-borders": "rgba(255,255,255,0.16)",
            "--tw-prose-td-borders": "rgba(255,255,255,0.08)",
          },
        },
      }),
    },
  },
  plugins: [typography],
};

export default config;
