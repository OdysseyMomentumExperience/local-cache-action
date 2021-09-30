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
import {restoreCache} from '../src/restore'

let tmpDir: string
beforeEach(async () => {
  const dirPrefix = path.join(os.tmpdir(), 'restore-test-')
  tmpDir = await fs.promises.mkdtemp(dirPrefix)
  jest.spyOn(process, 'cwd').mockImplementation(() => tmpDir)
})
afterEach(async () => {
  jest.resetAllMocks()
  await fs.promises.rmdir(tmpDir, {recursive: true})
})

describe('restoreCache', () => {
  describe('with no previous cache', () => {
    const target = 'Library'
    const restoreKeys = 'foo-bar'
    const cacheDir = `${__dirname}/foobar`
    test('should create destination directory if it does not exist', async () => {
      await restoreCache(target, [restoreKeys], cacheDir)
      const expectedDir = path.join(tmpDir, target)
      expect(fs.existsSync(expectedDir)).toBeTruthy()
    })
  })
  describe('with previous cache', () => {
    const target = 'Library'
    const cacheDir = `${__dirname}/cacheDir`
    test('exact match should copy cache to directory', async () => {
      await restoreCache(target, ['foo-bar-baz'], cacheDir)
      const expectedFile = path.join(tmpDir, target, 'cached.txt')
      expect(fs.existsSync(expectedFile)).toBe(true)
    })
    test('prefix match should copy cache to directory', async () => {
      await restoreCache(target, ['qux', 'foo-'], cacheDir)
      const expectedFile = path.join(tmpDir, target, 'cached.txt')
      expect(fs.existsSync(expectedFile)).toBe(true)
    })
  })
})
