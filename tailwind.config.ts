import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    ".src/app/components/**/*.{js,ts,jsx,tsx,mdx}",
    ".src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-primary)",
        foreground: "var(--color-secondary)"
      }
    },
    screens: {
      xs: "300px",
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px"
    }
  }
};
export default config;
