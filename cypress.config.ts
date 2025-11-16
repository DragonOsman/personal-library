import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://localhost:3000",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    port: 3000
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack"
    }
  }
});
