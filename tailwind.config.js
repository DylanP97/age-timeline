/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Driven by CSS variables (RGB channel triplets) so the whole palette
        // can be swapped per theme — see src/index.css.
        ink: {
          900: "rgb(var(--ink-900) / <alpha-value>)",
          800: "rgb(var(--ink-800) / <alpha-value>)",
          700: "rgb(var(--ink-700) / <alpha-value>)",
          600: "rgb(var(--ink-600) / <alpha-value>)",
          500: "rgb(var(--ink-500) / <alpha-value>)",
        },
        gold: {
          DEFAULT: "rgb(var(--gold) / <alpha-value>)",
          soft: "rgb(var(--gold-soft) / <alpha-value>)",
          dim: "rgb(var(--gold-dim) / <alpha-value>)",
        },
        cyan: {
          DEFAULT: "rgb(var(--cyan) / <alpha-value>)",
          soft: "rgb(var(--cyan-soft) / <alpha-value>)",
          dim: "rgb(var(--cyan-dim) / <alpha-value>)",
        },
        frost: {
          DEFAULT: "rgb(var(--frost) / <alpha-value>)",
          dim: "rgb(var(--frost-dim) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      transitionTimingFunction: {
        glide: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "92%": { opacity: "1" },
          "94%": { opacity: "0.86" },
          "96%": { opacity: "1" },
          "98%": { opacity: "0.92" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.4s ease both",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        flicker: "flicker 6s steps(1, end) infinite",
      },
    },
  },
  plugins: [],
};
