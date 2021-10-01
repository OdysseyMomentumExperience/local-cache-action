import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import {
  describe,
  expect,
  test,
  beforeEach,
  afterEach,
  jest
} from '@jest/globals'
import {subMonths, subDays} from 'date-fns'

import {expireCache} from '../src/expire'

describe('expireCache', () => {
  let tmpDir: string
  beforeEach(async () => {
    const dirPrefix = path.join(os.tmpdir(), 'expire-test-')
    tmpDir = await fs.promises.mkdtemp(dirPrefix)
  })
  afterEach(async () => {
    jest.resetAllMocks()
    await fs.promises.rmdir(tmpDir, {recursive: true})
  })

  beforeEach(async () => {
    const ancient = path.join(tmpDir, 'ancient')
    await fs.promises.mkdir(ancient)
    await fs.promises.utimes(ancient, 0, 0)

    const old = path.join(tmpDir, 'old')
    await fs.promises.mkdir(old)
    const oldDate = subMonths(new Date(), 3)
    await fs.promises.utimes(old, oldDate, oldDate)

    const recent = path.join(tmpDir, 'recent')
    await fs.promises.mkdir(recent)
    const recentDate = subDays(new Date(), 3)
    await fs.promises.utimes(recent, recentDate, recentDate)
  })
  test('should delete expired directories', async () => {
    await expireCache(tmpDir)
  })
})
