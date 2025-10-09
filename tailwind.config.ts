import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./src/app/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        text: "var(--color-text)",
        background: "var(--color-primary)",
        foreground: "var(--color-secondary)"
      },
      backgroundImage: {
        "gradient-main": "linear-gradient(to bottom right, #28292d, #105e86)"
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "'Helvetica Neue'", "sans-serif"]
      },
      spacing: {
        18: "4.5rem" // optional helper between 16 and 20
      }
    },
    screens: {
      xs: "500px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px"
    },
    plugins: [
      daisyui
    ]
  }
};
export default config;
