/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "ui-sans-serif", "sans-serif"],
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.08)",
        "glow-primary": "0 0 40px -10px rgba(99,102,241,0.55)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        devcamp: {
          primary: "#6366F1",
          "primary-content": "#0B1220",
          secondary: "#06B6D4",
          accent: "#D946EF",
          neutral: "#0B1220",
          "base-100": "#0F172A",
          "base-200": "#111827",
          "base-300": "#1F2937",
          info: "#38BDF8",
          success: "#22C55E",
          warning: "#F59E0B",
          error: "#EF4444",
        },
      },
      {
        light: {
          primary: "#6366F1",
          "primary-content": "#FFFFFF",
          secondary: "#06B6D4",
          accent: "#D946EF",
          neutral: "#0B1220",
          "base-100": "#FFFFFF",
          "base-200": "#F8FAFC",
          "base-300": "#EEF2F7",
          info: "#0EA5E9",
          success: "#16A34A",
          warning: "#D97706",
          error: "#DC2626",
        },
      },
    ],
  },
};
