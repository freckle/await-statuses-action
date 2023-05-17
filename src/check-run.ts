import * as github from "@actions/github";

export type GitHubClient = ReturnType<typeof github.getOctokit>;

export type CheckRun = {
  name: string;
  status: string;
  conclusion: string | null;
};

export async function listCheckRunsForRef(
  client: GitHubClient,
  ref: string
): Promise<CheckRun[]> {
  const options = client.rest.checks.listForRef.endpoint.merge({
    ...github.context.repo,
    ref: ref,
  });

  const response: CheckRun[] = await client.paginate(options);

  return response;
}
