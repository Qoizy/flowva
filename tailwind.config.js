/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "circle-timer": {
          "0%": { strokeDashoffset: "251.2" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        "circle-timer": "circle-timer 8s linear forwards",
      },
    },
  },
  plugins: [],
};
