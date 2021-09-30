import * as fs from 'fs'
import * as path from 'path'

import * as core from '@actions/core'

import {absPath, copy} from './utils'

export async function restoreCache(
  destination: string,
  restoreKeys: string[],
  cacheDir: string
): Promise<[string?, string?, boolean?]> {
  try {
    await fs.promises.access(absPath(destination))
  } catch (err) {
    core.debug('Destination directory does not exist, creating.')
    await fs.promises.mkdir(absPath(destination), {recursive: true})
  }

  let contents: fs.Dirent[]
  try {
    contents = await fs.promises.readdir(cacheDir, {withFileTypes: true})
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err
    // cache dir doesn't exist
    core.warning(`Cache dir ${cacheDir} not found.`)
    return [undefined, undefined, undefined] // quick bailout
  }
  const subdirs = contents.filter(x => x.isDirectory()).map(x => x.name)
  const [matchedKey, matchedDir] = keyMatch(restoreKeys, subdirs)
  if (matchedKey && matchedDir) {
    core.info(`Matched dir ${matchedDir} with key ${matchedKey}`)
    const absMatchedDir = path.join(cacheDir, matchedDir)
    const absDestination = absPath(destination)
    const exactMatch = matchedKey === matchedDir
    await copy(absMatchedDir, absDestination)
    return [absMatchedDir, absDestination, exactMatch]
  }
  return [undefined, undefined, undefined]
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
