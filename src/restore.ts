import * as core from '@actions/core'
import * as fs from 'fs'
import * as path from 'path'

import {absPath, copy} from './utils'

export async function restoreCache(
  destination: string,
  restoreKeys: string[],
  cacheDir: string
): Promise<[string?, string?, boolean?]> {
  const absDestination = absPath(destination)
  try {
    await fs.promises.access(absDestination)
  } catch (err) {
    core.debug('Destination directory does not exist, creating.')
    await fs.promises.mkdir(absDestination, {recursive: true})
  }

  let contents: fs.Dirent[]
  try {
    contents = await fs.promises.readdir(cacheDir, {withFileTypes: true})
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err
    // cache dir doesn't exist
    core.warning(`Cache dir ${cacheDir} not found.`)
    return [undefined, absDestination, undefined] // quick bailout
  }
  const subdirs = contents.filter(x => x.isDirectory()).map(x => x.name)
  const [matchedKey, matchedDir] = keyMatch(restoreKeys, subdirs)
  if (matchedKey && matchedDir) {
    core.info(`Matched dir ${matchedDir} with key ${matchedKey}`)
    const absMatchedDir = path.join(cacheDir, matchedDir)
    const exactMatch = matchedKey === matchedDir
    await copy(absMatchedDir, absDestination)
    return [absMatchedDir, absDestination, exactMatch]
  }
  return [undefined, absDestination, undefined]
}

function keyMatch(keys: string[], directories: string[]): [string?, string?] {
  // consider restoreKeys 'ordered'
  for (const key of keys) {
    for (const dir of directories) {
      if (dir === key || dir.startsWith(key)) {
        return [key, dir]
      }
    }
  }
  return [undefined, undefined]
}
