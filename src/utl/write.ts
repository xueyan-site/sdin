import fse from 'fs-extra'
import chardet from 'chardet'
import { template } from 'lodash'
import { withPath } from './path'
import { deepRead } from './read'
import type { DeepReadNode } from './read'

/**
 * 深度遍历的节点信息
 */
export type DeepCopyNode = DeepReadNode

/**
 * 深度遍历复制各个文件的信息
 * 文件名以__开头，是为了避开git、npm等，需要修正
 */
export async function deepCopy(
  source: string,
  target: string,
  handler?: (node: DeepCopyNode, content: Buffer) => ((string | Buffer) | Promise<(string | Buffer)>),
  filter?: (node: DeepCopyNode) => (boolean | Promise<boolean>),
  rename?: (node: DeepCopyNode, target: string) => string
) {
  const specFileExp = /^__(.*\.\w+)__$/
  const __handler__ = async (node: DeepCopyNode) => {
    let content = await fse.readFile(node.current)
    let content1: string | Buffer = content
    if (handler) {
      content1 = await handler(node, content)
    }
    let filePath = ''
    if (rename) {
      filePath = rename(node, target)
    }
    if (!filePath) {
      const matched = specFileExp.exec(node.name)
      if (matched && matched[1]) {
        filePath = withPath(target, node.offset, '../' + matched[1])
      } else if (node.offset) {
        filePath = withPath(target, node.offset)
      } else {
        filePath = target
      }
    }
    await fse.outputFile(filePath, content1)
  }
  await deepRead(
    source,
    __handler__,
    filter
  )
}

/**
 * 更换文本
 */
export function getReplaceHandler(variables: AnyObject) {
  return function replace(_node: DeepCopyNode, content: Buffer) {
    const encodeInfo = chardet.analyse(content)
    if(encodeInfo.find(i => i.name === 'UTF-8')) {
      const compiled = template(content.toString('utf8'), {
        interpolate: /<%=([\s\S]+?)%>/g
      })
      return compiled(variables)
    }
    return content
  }
}
