import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "coverage/**",
      ".agents/**",
      ".claude/**",
      ".cursor/**",
      ".devin/**",
      "src/prisma/contract.d.ts",
    ],
  },
  {
    files: ["src/**/*.ts"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
)
