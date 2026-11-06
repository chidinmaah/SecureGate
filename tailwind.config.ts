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
        accent: "#1D5A8F",
        surface: "#FFFFFF",
        border: "#E5E7EB",
        muted: "#4B5563",
        bg: "#F9FAFB",
        text: "#111827",
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
        brand: {
          DEFAULT: "#01A79E",
          hover: "#00A39B",
          deep: "#073042",
          darker: "#052530",
          ink: "#020D12",
          mint: "#E0F2F1",
          pale: "#F0FAF9",
          border: "#C5ECEA",
          green: "#26C165",
        },
      },
    },
  },
  plugins: [],
};
export default config;
