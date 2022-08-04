import { join } from 'path'
import { deepRead } from '../utils/read'

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
