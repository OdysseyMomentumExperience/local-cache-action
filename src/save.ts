import * as core from '@actions/core'
import * as fs from 'fs'
import * as path from 'path'

import {absPath, copy} from './utils'

/**
 * Save a projects direcotory to the (local) cache.
 */
export async function saveCache(
  key: string,
  targetDir: string,
  cacheDir: string
): Promise<void> {
  const absCacheDir = path.join(absPath(cacheDir), key)
  try {
    await fs.promises.access(absCacheDir)
    core.info('Cache directory already exist, skipping.')
    return
  } catch (err) {
    core.debug('Cache directory does not exist, creating.')
    await fs.promises.mkdir(absCacheDir, {recursive: true})
  }
  await copy(targetDir, absCacheDir)
}
