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

import {saveCache} from '../src/save'

let tmpDir: string
describe('saveCache', () => {
  beforeEach(async () => {
    const dirPrefix = path.join(os.tmpdir(), 'save-test-')
    tmpDir = await fs.promises.mkdtemp(dirPrefix)
  })
  afterEach(async () => {
    jest.resetAllMocks()
    await fs.promises.rmdir(tmpDir, {recursive: true})
  })
  describe('new cache key', () => {
    const key = 'foo-bar-baz'
    const targetDir = `${__dirname}${path.sep}projectDir`
    test('should copy to cache dir', async () => {
      await saveCache(key, targetDir, tmpDir)
      const expectedFile = path.join(tmpDir, key, 'foo.txt')
      expect(fs.existsSync(expectedFile)).toBeTruthy()
    })
  })
})
