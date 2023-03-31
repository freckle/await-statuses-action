import * as core from "@actions/core";
import * as github from "@actions/github";

import { getInputs } from "./inputs";
import type { Statuses } from "./status";
import { checkRunsToStatuses } from "./status";
import { listCheckRunsForRef } from "./check-run";

async function run() {
  try {
    const { ref, statusNames, pollSeconds, pollLimit, githubToken } =
      getInputs();

    const prRef = github.context.payload.pull_request?.head.ref;
    const shaRef = github.context.sha;
    const statusRef = ref !== null && ref.trim() !== "" ? ref : prRef ?? shaRef;

    if (!statusRef) {
      throw new Error(
        `Unable to determine ref. Input: ${ref}, PullRequest: ${prRef}, SHA: ${shaRef}`
      );
    }

    core.info(`Awaiting ${statusNames.length} statuse(s) on ${statusRef}`);

    const client = github.getOctokit(githubToken);

    for (let i = 1; true; i++) {
      if (i > pollLimit) {
        throw new Error(`Poll limit reached (${i} > ${pollLimit})`);
      }

      const checkRuns = await listCheckRunsForRef(client, statusRef);
      const statuses = await checkRunsToStatuses(checkRuns, statusNames);

      logStatuses(statuses);

      if (requirementsMet(statuses)) {
        core.info("All statuses successful");
        return;
      }

      core.info("Some statuses are still pending");
      core.info(`Polling again in ${pollSeconds} second(s)`);
      await sleep(pollSeconds);
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else if (typeof error === "string") {
      core.setFailed(error);
    } else {
      core.setFailed("Non-Error exception");
    }
  }
}

function logStatuses({ pending, succeeded, failed }: Statuses): void {
  succeeded.sort().forEach((s) => {
    core.info(`\u001b[32m✓\u001b[0m ${s} has \u001b[32msucceeded\u001b[0m`);
  });

  failed.sort().forEach((s) => {
    core.info(`\u001b[31mx\u001b[0m ${s} has \u001b[31mfailed\u001b[0m`);
  });

  pending.sort().forEach((s) => {
    core.info(`  ${s} is \u001b[33mpending\u001b[0m`);
  });
}

function requirementsMet({ pending, failed }: Statuses): boolean {
  if (failed.length > 0) {
    throw new Error(`Some required statuses have failed: ${failed.join(", ")}`);
  }

  return pending.length === 0;
}

function sleep(seconds: number) {
  const ms = seconds * 1000;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

run();
