import * as core from '@actions/core'
import * as fs from 'fs'
import * as path from 'path'

import {EXPIRATION_DAYS} from './constants'
import {absPath} from './utils'
import {differenceInDays} from 'date-fns'

export async function expireCache(cacheDir: string): Promise<void> {
  const absCacheDir = absPath(cacheDir)
  const contents = await fs.promises.readdir(absCacheDir, {withFileTypes: true})
  const subdirs = contents.filter(x => x.isDirectory()).map(x => x.name)
  for (const dir of subdirs) {
    const absDir = path.join(absCacheDir, dir)
    const dirDate = await getDirDate(absDir)
    const diff = differenceInDays(new Date(), dirDate)
    core.debug(`${dir} : ${diff} days old`)
    if (diff > EXPIRATION_DAYS) {
      core.info(`Expiring ${dir}`)
      // await fs.promises.rm(absDir, {recursive: true})  // Required nodejs v14+
      await fs.promises.rmdir(absDir, {recursive: true})
    }
  }
}

/**
 * Return the date we used for expiration check.
 */
async function getDirDate(absDir: string): Promise<Date> {
  // mtime of dir should be OK, since we never really modify these after creation
  // or maybe write our own file containing a timetamp?
  // So we can track actual last cache hit
  const stat = await fs.promises.stat(absDir)
  return stat.mtime
}
