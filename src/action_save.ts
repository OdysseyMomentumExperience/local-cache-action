import * as core from '@actions/core'

import {State} from './constants'
import {expireCache} from './expire'
import {saveCache} from './save'

async function run(): Promise<void> {
  try {
    const cacheTarget = core.getState(State.destination)
    core.info(`Cache target ${cacheTarget}`)
    if (cacheTarget) {
      const cacheDir = core.getState(State.cacheDir)
      const key = core.getInput('key', {required: true})
      core.info(`Cache directory ${cacheDir}`)
      await saveCache(key, cacheTarget, cacheDir)
      await expireCache(cacheDir)
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      core.setFailed(e.message)
    } else {
      core.setFailed(`${e}`)
    }
  }
}

run()
export default run
