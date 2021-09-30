import * as core from '@actions/core'

import {State} from './constants'
import {restoreCache} from './restore'

async function run(): Promise<void> {
  try {
    const path: string = core.getInput('path', {required: true})
    const restoreKeys: string[] = core.getMultilineInput('restore-keys')
    const cacheDir: string = core.getInput('cache-dir', {required: true})
    const saveKey: string = core.getInput('key', {required: true})

    core.info(`Cache ${path}`)
    core.info(`Restore keys: ${restoreKeys}`)
    core.info(`Destination : ${cacheDir}`)
    core.info(`Storage key : ${saveKey}`)

    const [matchedDir, destinationDir, exactMatch] = await restoreCache(
      path,
      restoreKeys,
      cacheDir
    )
    // State for the post save action to pick up
    core.saveState(State.match, matchedDir)
    core.saveState(State.destination, destinationDir)
    core.saveState(State.exactMatch, exactMatch)
    core.saveState(State.cacheDir, cacheDir)
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
