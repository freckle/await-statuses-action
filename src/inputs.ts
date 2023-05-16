import * as core from "@actions/core";

export type Format = "rich" | "brief";

export type Inputs = {
  ref: string | null;
  statusNames: string[];
  pollSeconds: number;
  pollLimit: number;
  format: Format;
  githubToken: string;
};

export function getInputs(): Inputs {
  return {
    ref: core.getInput("ref", { required: false }),
    statusNames: core.getMultilineInput("statuses", { required: true }),
    pollSeconds: getInputNum("poll-seconds"),
    pollLimit: getInputNum("poll-limit"),
    format: core.getInput("format", { required: true }) as Format,
    githubToken: getInput("github-token"),
  };
}

function getInput(name: string): string {
  return core.getInput(name, { required: true });
}

function getInputNum(name: string): number {
  return parseInt(getInput(name), 10);
}
