/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./global.css",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Green ramp (kept) — used for buttons, accents, gradients.
        primary: {
          950: "#081C15",
          900: "#1B4332",
          800: "#2D6A4F",
          700: "#40916C",
          600: "#52B788",
          500: "#74C69D",
          400: "#95D5B2",
          300: "#B7E4C7",
          200: "#D8F3DC",
          100: "#F0FFF4",
        },
        // Light theme semantic tokens (matched to screen4 / screen6).
        bg: "#F4F6F4", // app background (off-white)
        surface: "#FFFFFF", // cards
        surfaceAlt: "#EEF2EE", // subtle alternate surface
        ink: "#16241C", // primary text (near-black green)
        muted: "#6B7770", // secondary text
        faint: "#9AA39C", // tertiary text / placeholders
        line: "#E6E9E6", // borders / dividers
        tint: "#E8F2EC", // soft green chip / section background
        tintStrong: "#D4EADD", // stronger green tint
        brand: "#2D6A4F", // primary button green
        brandDark: "#1B4332", // deep green (badges / headings)
        glass: {
          white: "rgba(255,255,255,0.13)",
          whiteMedium: "rgba(255,255,255,0.22)",
          green: "rgba(45,106,79,0.55)",
          greenDark: "rgba(27,67,50,0.80)",
          border: "rgba(255,255,255,0.28)",
          borderStrong: "rgba(255,255,255,0.45)",
        },
      },
      fontFamily: {
        sans: ["System"],
      },
    },
  },
  plugins: [],
};
