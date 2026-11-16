
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: "#080B14",
          800: "#0D1220",
          700: "#131B2E",
          600: "#1C2940",
        },
        accent: {
          purple: "#A78BFA",
          blue: "#60A5FA",
          cyan: "#22D3EE",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(139,92,246,0.15)",
      },
    },
  },
  plugins: [],
};
