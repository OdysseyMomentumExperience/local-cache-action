import * as child_process from 'child_process'
import * as core from '@actions/core'
import * as io from '@actions/io'
import * as path from 'path'
import {promisify} from 'util'

const asyncExec = promisify(child_process.exec)

export function absPath(dir: string): string {
  return path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir)
}

export async function copy(src: string, dst: string): Promise<void> {
  await core.group(`Copy ${src} to ${dst}`, async () => {
    //const { stdout, stderr } = await asyncExec(`cp -arv ${src}/* ${dst}`)
    //await fs.promises.cp(src, dst)  // requires nodejs v16+
    const size = await getSize(src)
    core.info(`Src size: ${size}`)
    await io.cp(src, dst, {recursive: true, copySourceDirectory: false})
  })
}

async function getSize(dir: string): Promise<string> {
  const {stdout} = await asyncExec(`du -sh ${dir}`)
  // <human readable size>  <path>
  // Not gonna parse it, it's fine for our output
  return stdout
}
