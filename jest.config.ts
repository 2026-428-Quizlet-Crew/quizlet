/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const universalConfig: Config = {
  clearMocks: true,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

const nodeProject = createJestConfig({
  ...universalConfig,
  displayName: "node",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
});

const domProject = createJestConfig({
  ...universalConfig,
  displayName: "jsdom",
  testEnvironment: "jsdom",
  testMatch: ["**/*.test.tsx"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
});

const config = async (): Promise<Config> => ({
  projects: [await nodeProject(), await domProject()],
});

export default config;
