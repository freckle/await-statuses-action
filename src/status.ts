import type { CheckRun } from "./check-run";
import type { StatusPattern } from "./status-pattern";

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
  patterns: StatusPattern[],
): Statuses {
  const seen: string[] = [];
  const pending: string[] = [];
  const succeeded: string[] = [];
  const failed: string[] = [];

  checkRuns.forEach((run) => {
    if (none(patterns, (p) => p.match(run.name))) {
      return; // Not required, don't care
    }

    seen.push(run.name);

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
        ", ",
      )}`,
    );
  });

  // Add statuses that we didn't see at all as pending
  patterns.forEach((p) => {
    if (!p.optional && !p.matchAny(seen)) {
      pending.push(p.raw);
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

function none<T>(xs: Array<T>, fn: (x: T) => boolean): boolean {
  for (const x of xs) {
    if (fn(x)) {
      return false;
    }
  }

  return true;
}
