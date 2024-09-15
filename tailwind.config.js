/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#f8fafc",
          dark: "#020617",
        },
        secondary: {
          light: "#e5e5e5",
          dark: "#27272a",
        },
        ternary: {
          light: "#e7e5e4",
          dark: "#292524",
        },
        text: {
          dark: "#E8E6E3",
          light: "#020617",
        },
        bg: {
          dark: "#171717",
          light: "#f5f5f5",
        },
        hover: {
          dark: "#2d2f30",
          light: "#c4c2c1",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
