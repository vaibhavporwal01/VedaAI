import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#E8452A",
        orangeButton: "#FF5623",
        ink: "#303030",
        primary: "#1A1A1A",
        primaryMcp: "#181818",
        muted: "#6B7280",
        mutedMcp: "#5E5E5E",
        line: "#E5E7EB",
        page: "#D9D9D9",
        soft: "#EEEEEE",
        disabled: "#A9A9A9",
        success: "#22C55E"
      },
      fontFamily: {
        sans: ["Bricolage Grotesque", "Inter", "Arial", "sans-serif"]
      },
      boxShadow: {
        realistic: "0 32px 48px rgba(0,0,0,0.2), 0 16px 48px rgba(0,0,0,0.12)",
        card: "0 18px 42px rgba(0,0,0,0.08)",
        soft: "0 12px 32px rgba(0,0,0,0.08)"
      },
      screens: {
        tablet: "768px",
        desktop: "1024px"
      }
    }
  },
  plugins: []
};

export default config;
