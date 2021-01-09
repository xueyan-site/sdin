import fse from 'fs-extra'
import chardet from 'chardet'
import template from 'lodash/template'
import { withPath, cmdPath } from './path'
import { deepReadByPath, DeepReadNodeInfo } from './read'
import RootProject from '../projects/root-project'

/**
 * 深度遍历的节点信息
 */
export type DeepCopyNodeInfo = DeepReadNodeInfo

/**
 * 深度遍历复制各个文件的信息
 * @param projectInfo 
 */
export async function deepCopyByPath(
  source: string,
  target: string,
  options: {
    filter?: (node: DeepCopyNodeInfo) => (boolean | Promise<boolean>)
    handler?: (node: DeepCopyNodeInfo, content: Buffer) => ((string | Buffer) | Promise<(string | Buffer)>)
  } = {}
) {
  const specFileExp = /^__(.*\.\w+)__$/
  const handler = async (node: DeepCopyNodeInfo) => {
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
  await deepReadByPath(
    source,
    handler,
    {
      filter: options.filter
    }
  )
}

/**
 * 复制项目模板
 * @param project
 */
export async function copyProjectTemplate<T_Project extends RootProject<any>>(project: T_Project) {
  const handler = (_node: DeepCopyNodeInfo, content: Buffer) => {
    const encodeInfo = chardet.analyse(content)
    if(encodeInfo.find(i => i.name === 'UTF-8')) {
      const compiled = template(content.toString('utf8'), { 
        interpolate: /<%=([\s\S]+?)%>/g 
      })
      return compiled(project)
    }
    return content
  }
  await deepCopyByPath(
    cmdPath(`tmp/${project.type}`),
    project.path,
    {
      handler
    }
  )
}
