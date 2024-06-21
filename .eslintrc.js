import { defineConfig } from "eslint-define-config";

export default defineConfig({
  env: {
    node: true,
  },
  plugins: ["express"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: ["module", "commonjs"],
  },
  extends: "next/core-web-vitals",
  ignorePatterns: [".github/*", "node_modules/*", "dumbcode/*", "logs/*"],
  rules: {
    "no-console": 2,
    "no-unused-vars": 1,
    "@typescript-eslint/no-explicit-any": "off",
  },
});
