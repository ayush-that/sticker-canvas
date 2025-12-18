/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#040404",
        surface: "rgba(255, 255, 255, 0.03)",
        "surface-hover": "rgba(255, 255, 255, 0.06)",
        elevated: "rgba(6, 6, 6, 0.8)",
        "text-primary": "#e6e6e6",
        "text-secondary": "#bfbfbf",
        "text-muted": "#8f8f8f",
        "text-inverse": "#023000",
        accent: {
          DEFAULT: "#89D888",
          hover: "#9de89c",
          glow: "rgba(137, 216, 136, 0.3)",
        },
        "border-subtle": "rgba(255, 255, 255, 0.04)",
        "border-medium": "rgba(255, 255, 255, 0.08)",
      },
      fontFamily: {
        display: ["Outfit", "SF Pro Display", "sans-serif"],
        body: ["Inter", "SF Pro Text", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.5rem",
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
        "3xl": "48px",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        pill: "9999px",
      },
      boxShadow: {
        soft: "0 6px 20px rgba(0, 0, 0, 0.6)",
        elevated: "0 18px 40px rgba(0, 0, 0, 0.7)",
        glow: "0 0 20px rgba(137, 216, 136, 0.3)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "200ms",
        slow: "350ms",
      },
    },
  },
  plugins: [],
};
