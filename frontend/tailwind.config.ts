import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: "#152238",
          900: "#1A365D", // Deep slate blue (design token)
          950: "#0F1E33",
        },
        charcoal: {
          800: "#2D3748", // Soft charcoal (design token)
          900: "#1A202C",
        },
        sage: {
          500: "#48BB78",
          600: "#2B6CB0", // Muted accent (design token)
          700: "#276749",
        },
        aqi: {
          good: "#2E7D32",       // 0-50
          moderate: "#D97706",   // 51-100 (high-contrast amber)
          sensitive: "#EA580C",  // 101-150
          unhealthy: "#C53030",  // 151-200 (dark crimson)
          veryUnhealthy: "#7B1FA2", // 201-300 (deep purple)
          hazardous: "#4A148C",  // 300+
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
