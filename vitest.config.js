import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    mockReset: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      // all + include: report every src file, not just ones a test loaded
      all: true,
      include: ["src/**/*.ts"],
      // Thin wiring over @actions/* and the Octokit client, covered by the
      // integration CI job instead
      exclude: ["src/main.ts", "src/inputs.ts", "src/check-run.ts"],
      // Set at what status.ts actually covers today, not the template's flat
      // 70%, so a real regression fails instead of being absorbed by slack.
      // Remove to stop enforcing coverage (also revert ci.yml's pnpm coverage
      // -> pnpm test)
      thresholds: {
        lines: 93,
        branches: 83,
        functions: 100,
        statements: 93,
      },
    },
  },
});
