import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ===== MARKIQ DESIGN SYSTEM COLORS =====
      colors: {
        primary: {
          DEFAULT: "#1B4FFF",
          light: "#EEF2FF",
          dark: "#1440DD",
          50: "#F0F4FF",
          100: "#E0E9FF",
          500: "#1B4FFF",
          600: "#1440DD",
          700: "#0F2FB0",
        },
        secondary: {
          DEFAULT: "#FFB800",
          light: "#FFF8E6",
        },
        success: {
          DEFAULT: "#00A86B",
          light: "#E6FAF0",
          border: "#A8DFC8",
        },
        error: {
          DEFAULT: "#FF4444",
          light: "#FEE6E6",
          border: "#FFAAAA",
        },
        warning: {
          DEFAULT: "#B8860B",
          light: "#FFF8E6",
          border: "#FFD88A",
        },
        // Platform colors
        instagram: "#8B2FC9",
        snapchat: "#B8860B",
        google: "#FF6B35",
        tiktok: "#006E9E",
        twitter: "#1DA1F2",
        facebook: "#1877F2",
        // Text
        text: {
          primary: "#1A1A2E",
          secondary: "#4A5568",
          muted: "#718096",
        },
        // Borders
        border: {
          DEFAULT: "#E2E8F0",
          secondary: "#CBD5E0",
          tertiary: "#EDF2F7",
        },
        // Backgrounds
        background: {
          DEFAULT: "#F8FAFF",
          secondary: "#F1F5F9",
          tertiary: "#E8EDF5",
        },
      },
      fontFamily: {
        sans: ["Inter", "Arial", "Tajawal", "sans-serif"],
        arabic: ["Tajawal", "Cairo", "sans-serif"],
        mono: ["Courier New", "monospace"],
      },
      fontSize: {
        "2xs": ["10px", "14px"],
        xs: ["12px", "16px"],
        sm: ["13px", "18px"],
        base: ["14px", "20px"],
        md: ["15px", "22px"],
        lg: ["16px", "24px"],
        xl: ["18px", "26px"],
        "2xl": ["20px", "28px"],
        "3xl": ["24px", "32px"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
      },
      boxShadow: {
        nav: "0 1px 3px rgba(0,0,0,0.08)",
        card: "0 1px 4px rgba(0,0,0,0.06)",
        dropdown: "0 8px 24px rgba(0,0,0,0.10)",
        modal: "0 16px 48px rgba(0,0,0,0.15)",
      },
      spacing: {
        nav: "52px", // Top Nav height
        breadcrumb: "34px",
        "page-header": "72px",
      },
    },
  },
  plugins: [
    
    
  ],
};

export default config;
