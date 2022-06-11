import { existsSync } from 'fs-extra'
import { join } from 'path'
import { printExit, printTask } from './console'
import { deepRead } from './read'
import { deepCopy, getReplaceHandler } from './write'

export function copyProject(
  source: string,
  target: string,
  scope: Record<string, any>
): Promise<void> {
  if (existsSync(target)) {
    return printExit('project already exists in ' + target)
  }
  return printTask({
    color: true,
    info: `copy project to ${target}`,
    failed: `project cope to ${target} failed`,
    success: `project copied to ${target} successfully`,
    task: () => {
      return deepCopy(
        source,
        target,
        getReplaceHandler(scope)
      )
    }
  })
}

/**
 * 获取不规范文件名
 */
export async function getIrregularFileNames(
  src: string, // 需要扫描的代码路径
  prefix?: string // 返回的路径中，需要补上的公共路径
): Promise<string[]> {
  const ALLOW_EXP = /^[a-z0-9][a-z0-9\-\.]+$/
  const fileList: string[] = []
  await deepRead(src, node => {
    if (!ALLOW_EXP.test(node.name)) {
      fileList.push(prefix ? join(prefix, node.offset) : node.offset)
    }
  })
  return fileList
}
