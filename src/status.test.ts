import { checkRunsToStatuses } from "./status";
import TEST_CHECK_RUNS from "./fixtures/megarepo-check-runs.json";

test("For an example ref on megarepo", async () => {
  const statuses = checkRunsToStatuses(TEST_CHECK_RUNS, [
    "backend / test",
    "platform-frontend / platform-image",
    "test-sql",
    "unknown-status",
  ]);

  expect(statuses.pending).toEqual(["unknown-status"]);
  expect(statuses.succeeded).toEqual(["backend / test", "test-sql"]);
  expect(statuses.failed).toEqual(["platform-frontend / platform-image"]);
});

test("With optional statuses", async () => {
  const statuses = checkRunsToStatuses(TEST_CHECK_RUNS, [
    "backend / test",
    "platform-frontend / platform-image?",
    "test-sql",
    "unknown-status ?",
  ]);

  // not waiting on unknown-status, but still failing on platform-image
  expect(statuses.pending).toEqual([]);
  expect(statuses.failed).toEqual(["platform-frontend / platform-image"]);
});
