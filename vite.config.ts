import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { coverageConfigDefaults } from "vitest/config";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), visualizer({ filename: "bundle-analysis.html", open: true }) as PluginOption],
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@contexts": "/src/contexts",
      "@hooks": "/src/hooks",
      "@types": "/src/types",
      "@config": "/config",
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/testSetup.ts",
    coverage: {
      provider: "v8",
      exclude: [
        "src/main.tsx",
        "**/__mocks__/**",
        "**/*.test.ts",
        "**/*.test.tsx",
        ...coverageConfigDefaults.exclude,
      ],
    },
  },
});
