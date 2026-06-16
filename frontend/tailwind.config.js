/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--foreground)",
        },
        border: "var(--border)",
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--foreground)",
        },
        brand: {
          DEFAULT: "#6366f1",
          hover: "#4f46e5",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      keyframes: {
        fadeInUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInRight: {
          "0%":   { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%":   { opacity: "0", transform: "scale(0.93)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%":     { transform: "translateY(-5px)" },
        },
        wiggle: {
          "0%,100%": { transform: "rotate(-3deg)" },
          "50%":     { transform: "rotate(3deg)" },
        },
        slideDown: {
          "0%":   { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up":     "fadeInUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in":        "fadeIn 0.3s ease forwards",
        "slide-in-right": "slideInRight 0.35s cubic-bezier(0.16,1,0.3,1) forwards",
        "scale-in":       "scaleIn 0.25s cubic-bezier(0.16,1,0.3,1) forwards",
        "shimmer":        "shimmer 1.6s linear infinite",
        "float":          "float 3s ease-in-out infinite",
        "wiggle":         "wiggle 0.4s ease-in-out",
        "slide-down":     "slideDown 0.25s ease forwards",
      },
      boxShadow: {
        "card":    "0 2px 12px rgba(99,102,241,0.07), 0 1px 4px rgba(0,0,0,0.04)",
        "card-hover": "0 8px 30px rgba(99,102,241,0.14), 0 2px 8px rgba(0,0,0,0.06)",
        "card-dark":  "0 2px 12px rgba(0,0,0,0.4)",
        "glow-indigo": "0 0 20px rgba(99,102,241,0.35)",
      },
    },
  },
  plugins: [],
};
