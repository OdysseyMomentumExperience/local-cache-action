import * as core from '@actions/core'
import * as io from '@actions/io'
import * as path from 'path'

export function absPath(dir: string): string {
  return path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir)
}

export async function copy(src: string, dst: string): Promise<void> {
  await core.group(`Copy ${src} to ${dst}`, async () => {
    //const { stdout, stderr } = await asyncExec(`cp -arv ${src}/* ${dst}`)
    //await fs.promises.cp(src, dst)
    //await fsExtra.copy(src, dst)
    await io.cp(src, dst, {recursive: true, copySourceDirectory: false})
  })
}
