import * as core from '@actions/core'

import {getInputs} from './inputs.js'

vi.mock(import('@actions/core'), () => {
  return {
    getInput: vi.fn(),
    getMultilineInput: vi.fn()
  }
})

describe('getInputs', () => {
  it('reads and parses every input', () => {
    vi.mocked(core.getInput).mockImplementation((name: string) => {
      switch (name) {
        case 'ref':
          return 'some-branch'
        case 'poll-seconds':
          return '5'
        case 'poll-limit':
          return '1440'
        case 'format':
          return 'rich'
        case 'github-token':
          return '_token_'
        default:
          throw new Error(`Unexpected input: ${name}`)
      }
    })

    vi.mocked(core.getMultilineInput).mockReturnValue(['test-this', 'build-that'])

    const inputs = getInputs()

    expect(inputs).toEqual({
      ref: 'some-branch',
      statusNames: ['test-this', 'build-that'],
      pollSeconds: 5,
      pollLimit: 1440,
      format: 'rich',
      githubToken: '_token_'
    })
  })

  it('treats ref as optional and everything else as required', () => {
    vi.mocked(core.getInput).mockReturnValue('rich')
    vi.mocked(core.getMultilineInput).mockReturnValue([])

    getInputs()

    expect(core.getInput).toHaveBeenCalledWith('ref', {required: false})
    expect(core.getMultilineInput).toHaveBeenCalledWith('statuses', {required: true})
    expect(core.getInput).toHaveBeenCalledWith('poll-seconds', {required: true})
    expect(core.getInput).toHaveBeenCalledWith('poll-limit', {required: true})
    expect(core.getInput).toHaveBeenCalledWith('format', {required: true})
    expect(core.getInput).toHaveBeenCalledWith('github-token', {required: true})
  })
})
