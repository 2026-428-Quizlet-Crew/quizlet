import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jest from "eslint-plugin-jest";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.test.{ts,tsx,js,jsx}", "**/__tests__/**"],
    ...jest.configs["flat/recommended"],
  },
  {
    // Component folders, storage and classes expose their public API through
    // index.ts. Files inside a module import each other relatively
    // ("./DeckForm"), so this only blocks reaching into a module from outside.
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/components/*/*"],
              message:
                "Import from the folder's index instead (e.g. '@/components/deck-editor').",
            },
            {
              group: ["@/storage/*"],
              message: "Import from '@/storage' instead.",
            },
            {
              group: ["@/classes/*"],
              message: "Import from '@/classes' instead.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
