# Await Statuses Action

Await statuses on a ref. Succeed only when all succeed. Fail when any fail.

## Usage

Run this step until three statuses have succeeded on the current ref:

```yaml
- uses: freckle/await-statuses-action@v1
  with:
    statuses: |
      test-this
      build-that
      other / thing (that)
```

## Inputs and Outputs

- **ref**: the reference (branch or SHA) to poll statuses on
- **statuses**: status names to wait for, as a newline-separated string
- **poll-seconds**: number of seconds between polls
- **poll-limit**: maximum number of polls before giving up
- **github-token**: token to use

See [action.yml](./action.yml) for a complete list of inputs and outputs.

## Optional Statuses

Elements in the `statuses` list may optionally be suffixed by any number of
spaces and a `?`. This makes it acceptable if they never appear, but will still
consider it a failure if they do appear as failed. This can be useful for matrix
jobs whose statuses never appear in certain skipped scenarios, but we still want
to account for them if they fail.

Changing our usage example to:

```yaml
- uses: freckle/await-statuses-action@v1
  with:
    statuses: |
      test-this
      build-that
      other / thing (that) ?
```

This will result in us proceeding even if `other / thing (that)` never shows up,
but if it ever shows up as failed, we will still fail immediately.

## Caveats

This action works by querying the GitHub API for check-suites and their
check-runs. Statuses set directly on commits, and which only appear in the
`/commits/status` API, will not be visible to this action. That's simply because
the check-suite statuses are all _we_ need at the moment. Patches welcome.

## Versioning

Versioned tags will exist, such as `v1.0.0` and `v2.1.1`. Branches will exist
for each major version, such as `v1` or `v2` and contain the newest version in
that series.

## Release

To trigger a release (and update the `@v{major}` tag), merge a commit to `main`
that follows [Conventional Commits][]. In short,

- `fix:` to trigger a patch release,
- `feat:` for minor, and
- `feat!:` and major

We don't enforce conventional commits generally (though you are free do so),
it's only required if you want to trigger release.

[conventional commits]: https://www.conventionalcommits.org/en/v1.0.0/#summary

---

[LICENSE](./LICENSE)
