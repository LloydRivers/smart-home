import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    ignores: [
      "coverage/**",
      "src/index.ts",
      "src/features/*",
      "src/interfaces/index.ts",
      "src/test/*",
    ],
  }
);
