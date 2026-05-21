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
        primary: {
          DEFAULT: "#1E3A5F",
          hover: "#16304F",
        },
        accent: "#2E75B6",
        surface: "#FFFFFF",
        border: "#E5E7EB",
        muted: "#6B7280",
        bg: "#F9FAFB",
        success: {
          DEFAULT: "#16A34A",
          bg: "#F0FDF4",
        },
        error: {
          DEFAULT: "#DC2626",
          bg: "#FEF2F2",
        },
        warning: {
          DEFAULT: "#D97706",
          bg: "#FFFBEB",
        },
      },
      scale: {
        'display-large': '57px',
        // I will map the typography tokens here if needed, 
        // but I can also use standard tailwind classes or custom ones.
      },
    },
  },
  plugins: [],
};
export default config;
