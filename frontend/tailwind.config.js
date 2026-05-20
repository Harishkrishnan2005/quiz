/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f7f0",
          100: "#e5edd8",
          200: "#cadcae",
          300: "#afca84",
          400: "#92b866",
          500: "#739a49",
          600: "#59783a",
          700: "#42592d",
          800: "#2d3d20",
          900: "#1a2514"
        },
        ink: "#111827",
        dusk: "#243447",
        sand: "#f7f4ed"
      },
      boxShadow: {
        panel: "0 24px 60px rgba(17, 24, 39, 0.12)"
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at top left, rgba(115,154,73,0.18), transparent 38%), radial-gradient(circle at bottom right, rgba(36,52,71,0.16), transparent 32%)"
      }
    }
  },
  plugins: []
};
