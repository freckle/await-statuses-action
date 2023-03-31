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
    statusNames: getInputSep("statuses", "\n"),
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

function getInputSep(name: string, sep: string): string[] {
  return getInput(name)
    .split(sep)
    .map((x) => x.trim());
}
