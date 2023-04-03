import * as core from "@actions/core";

export type Inputs = {
  ref: string | null;
  statusNames: string[];
  pollSeconds: number;
  pollLimit: number;
  githubToken: string;
};

export function getInputs(): Inputs {
  return {
    ref: core.getInput("ref", { required: false }),
    statusNames: core.getMultilineInput("statuses", { required: true }),
    pollSeconds: getInputNum("poll-seconds"),
    pollLimit: getInputNum("poll-limit"),
    githubToken: getInput("github-token"),
  };
}

function getInput(name: string): string {
  return core.getInput(name, { required: true });
}

function getInputNum(name: string): number {
  return parseInt(getInput(name), 10);
}
