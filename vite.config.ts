import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { coverageConfigDefaults } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/testSetup.ts",
    coverage: {
      provider: "v8",
      exclude: ["src/main.tsx", ...coverageConfigDefaults.exclude],
    },
  },
});
