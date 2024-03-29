import type { CheckRun } from "./check-run";

const SUCCESS_CONCLUSIONS = ["neutral", "skipped", "success"];
const FAILURE_CONCLUSIONS = [
  "action_required",
  "cancelled",
  "failure",
  "stale",
  "startup_failure",
  "timed_out",
];

export type Statuses = {
  pending: string[];
  succeeded: string[];
  failed: string[];
};

export function checkRunsToStatuses(
  checkRuns: CheckRun[],
  statusNames: string[]
): Statuses {
  const allStatusNames: string[] = [];
  const waitForStatusNames: string[] = [];

  for (const statusName of statusNames) {
    if (statusName.endsWith("?")) {
      const trimmed = statusName.slice(0, -1).trim();
      allStatusNames.push(trimmed);
    } else {
      allStatusNames.push(statusName);
      waitForStatusNames.push(statusName);
    }
  }

  const all: string[] = [];
  const pending: string[] = [];
  const succeeded: string[] = [];
  const failed: string[] = [];

  checkRuns.forEach((run) => {
    if (!includes(allStatusNames, run.name)) {
      return; // Not required, don't care
    }

    all.push(run.name);

    if (run.conclusion === null) {
      return pending.push(run.name);
    }

    if (includes(SUCCESS_CONCLUSIONS, run.conclusion)) {
      return succeeded.push(run.name);
    }

    if (includes(FAILURE_CONCLUSIONS, run.conclusion)) {
      return failed.push(run.name);
    }

    throw new Error(
      `Unexpected CheckRun conclusion: ${
        run.conclusion
      }. Must be one of ${SUCCESS_CONCLUSIONS.concat(FAILURE_CONCLUSIONS).join(
        ", "
      )}`
    );
  });

  // Add statuses that we didn't see at all as pending
  waitForStatusNames.forEach((name) => {
    if (!includes(all, name)) {
      pending.push(name);
    }
  });

  return {
    pending,
    failed,
    succeeded,
  };
}

function includes<T>(xs: Array<T>, x: T): boolean {
  return xs.indexOf(x) !== -1;
}
