// eslint.config.ts
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";
import globals from "globals";

export default [
  // Base JS recommended rules
  js.configs.recommended,
  {
    ignores: ["src/generated/prisma/**"]
  },

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      react,
      "jsx-a11y": jsxA11y,
      "react-hooks": reactHooks,
      "@next/next": nextPlugin
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
          arrowFunctions: true,
          destructuring: true,
          templateStrings: true
        },
        projectService: true
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.es2021
      }
    },
    rules: {
      yoda: "error",
      "prefer-const": "error",
      "space-before-function-paren": "off",
      "@typescript-eslint/await-thenable": "warn",
      "no-undef": "warn",
      "no-unused-vars": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      quotes: ["error", "double", { allowTemplateLiterals: true }],
      semi: "error",
      "no-extra-semi": "error",
      "comma-dangle": "error",
      "react-hooks/exhaustive-deps": "warn"
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  }
];