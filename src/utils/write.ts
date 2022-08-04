import { readFile, outputFile } from 'fs-extra'
import chardet from 'chardet'
import { template } from 'lodash'
import { resolve } from 'path'
import { deepRead } from './read'
import type { DeepReadNode } from './read'

export type DeepCopyNode = DeepReadNode

export type DeepCopyHandler = (
  node: DeepCopyNode, 
  content: Buffer
) => ((string | Buffer) | Promise<(string | Buffer)>)

export type DeepCopyFilter = (
  node: DeepCopyNode
) => (boolean | Promise<boolean>)

export type DeepCopyRename = (
  node: DeepCopyNode, 
  target: string
) => string

export type DeepCopyRedirect = (
  node: DeepCopyNode, 
  target: string
) => string

/**
 * 深度遍历复制各个文件的信息
 * 文件名以__开头时，需要修正（为了避开 git、npm 规则）
 */
export async function deepCopy(
  source: string, // 源文件路径
  target: string, // 目标文件路径
  handler?: DeepCopyHandler, // 转换文件内容的处理器
  filter?: DeepCopyFilter, // 过滤文件（为true才执行，否则跳过）
  rename?: DeepCopyRename, // 重定义目标文件名
  redirect?: DeepCopyRedirect // 重定向源文件路径
) {
  const SPEC_FILE_EXP = /^__(.*\.\w+)__$/
  const __handler__ = async (node: DeepCopyNode) => {
    let resPath = ''
    if (rename) {
      const newName = rename(node, target)
      if (newName) {
        resPath = node.offset ? resolve(target, node.offset) : target
        resPath = resolve(resPath, '..', newName)
      }
    }
    if (!resPath) {
      resPath = node.offset ? resolve(target, node.offset) : target
      if (node.name[0] === '_') {
        const matched = SPEC_FILE_EXP.exec(node.name)
        if (matched && matched[1]) {
          resPath = resolve(resPath, '../' + matched[1])
        }
      }
    }
    if (resPath) {
      let srcPath = (redirect && redirect(node, target)) || node.current
      let srcData = await readFile(srcPath)
      let resData: string | Buffer = srcData
      if (handler) {
        resData = await handler(node, srcData)
      }
      await outputFile(resPath, resData)
    }
  }
  await deepRead(
    source,
    __handler__,
    filter
  )
}

/**
 * 获取lodash模版形式的字符串替换器
 */
export function getReplaceHandler(variables: Record<string, any>) {
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

/**
 * 双花括号形式的字符串替换器
 */
export function twoBracesReplacer<T>(str: T, variables: Record<string, any>) {
  if (str && typeof str === 'string' && str.includes('{{')) {
    return str.replace(/{{(\w+)}}/g, (_i, key) => (
      key in variables ? variables[key] : key
    ))
  } else {
    return str
  }
}
