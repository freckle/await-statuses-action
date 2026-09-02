import type {CheckRun, GitHubClient} from './check-run.js'
import {listCheckRunsForRef} from './check-run.js'

vi.mock(import('@actions/core'), () => {
  return {
    debug: vi.fn()
  }
})

vi.mock(import('@actions/github'), () => {
  return {
    context: {repo: {owner: 'freckle', repo: 'megarepo'}}
  } as unknown as typeof import('@actions/github')
})

describe('listCheckRunsForRef', () => {
  it('paginates check-runs for the repo and ref', async () => {
    const merged = {url: '/repos/freckle/megarepo/commits/some-branch/check-runs'}
    const merge = vi.fn(() => merged)

    const checkRuns: CheckRun[] = [
      {name: 'test-this', status: 'completed', conclusion: 'success'},
      {name: 'build-that', status: 'in_progress', conclusion: null}
    ]

    const paginate = vi.fn(async () => checkRuns)

    const client = {
      rest: {checks: {listForRef: {endpoint: {merge}}}},
      paginate
    } as unknown as GitHubClient

    const result = await listCheckRunsForRef(client, 'some-branch')

    expect(merge).toHaveBeenCalledWith({
      owner: 'freckle',
      repo: 'megarepo',
      ref: 'some-branch'
    })
    expect(paginate).toHaveBeenCalledWith(merged)
    expect(result).toEqual(checkRuns)
  })
})
