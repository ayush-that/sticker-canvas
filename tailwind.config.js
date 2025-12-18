/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-canvas': '#040404',
        'bg-surface': 'rgba(255, 255, 255, 0.03)',
        'bg-surface-hover': 'rgba(255, 255, 255, 0.06)',
        'bg-elevated': 'rgba(6, 6, 6, 0.8)',

        'text-primary': '#e6e6e6',
        'text-secondary': '#bfbfbf',
        'text-muted': '#8f8f8f',
        'text-inverse': '#023000',

        'accent-primary': '#89D888',
        'accent-primary-hover': '#9de89c',
        'accent-glow': 'rgba(137, 216, 136, 0.3)',

        'border-subtle': 'rgba(255, 255, 255, 0.04)',
        'border-medium': 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        display: ['Outfit', 'SF Pro Display', 'sans-serif'],
        body: ['Inter', 'SF Pro Text', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'soft': '0 6px 20px rgba(0, 0, 0, 0.6)',
        'elevated': '0 18px 40px rgba(0, 0, 0, 0.7)',
        'glow': '0 0 20px var(--accent-glow)',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        'pill': '9999px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '48px',
      }
    },
  },
  plugins: [],
}
