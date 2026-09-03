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
      // Remove to stop enforcing coverage (also revert ci.yml's pnpm coverage -> pnpm test)
      thresholds: {
        lines: 70,
        branches: 70,
        functions: 70,
        statements: 70,
      },
    },
  },
});
