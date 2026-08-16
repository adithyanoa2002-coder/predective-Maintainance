import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: "#0C0F12",
          900: "#101316",
          800: "#171B20",
          700: "#1E232A",
          600: "#2A3038",
          500: "#3A414B",
          400: "#5B6470",
        },
        ink: {
          primary: "#E8EAED",
          secondary: "#9099A6",
          muted: "#5B6470",
        },
        amber: {
          DEFAULT: "#FFB020",
          dim: "#B47C1B",
          50: "#FFF4DF",
        },
        healthy: {
          DEFAULT: "#3FD6C0",
          dim: "#1F7C6F",
        },
        critical: {
          DEFAULT: "#FF5D5D",
          dim: "#8A2E2E",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(255,255,255,0.03) inset",
      },
    },
  },
  plugins: [],
};

export default config;
