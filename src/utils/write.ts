import fse from 'fs-extra'
import { withPath } from './path'
import { deepRead, DeepReadNode } from './read'

/**
 * 深度遍历的节点信息
 */
export type DeepCopyNode = DeepReadNode

/**
 * 深度遍历复制各个文件的信息
 * @param projectInfo 
 */
export async function deepCopy(
  source: string,
  target: string,
  options: {
    filter?: (node: DeepCopyNode) => (boolean | Promise<boolean>)
    handler?: (node: DeepCopyNode, content: Buffer) => ((string | Buffer) | Promise<(string | Buffer)>)
  } = {}
) {
  const specFileExp = /^__(.*\.\w+)__$/
  const handler = async (node: DeepCopyNode) => {
    let content = await fse.readFile(node.current)
    let content1: string | Buffer = content
    if (options.handler) {
      content1 = await options.handler(node, content)
    }
    let filePath = ''
    const matched = specFileExp.exec(node.name)
    if (matched && matched[1]) {
      filePath = withPath(target, node.offset, '../' + matched[1])
    } else {
      filePath = withPath(target, node.offset)
    }
    await fse.outputFile(filePath, content1)
  }
  await deepRead(
    source,
    handler,
    {
      filter: options.filter
    }
  )
}
