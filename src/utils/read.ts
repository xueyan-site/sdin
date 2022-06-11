import { existsSync, statSync, readdir, readJSONSync } from 'fs-extra'
import { isPlainObject, isString } from 'lodash'
import { resolve, join, basename } from 'path'
import { printExit } from './console'
import type { Stats } from 'fs-extra'

/**
 * 深度遍历的节点信息
 */
export interface DeepReadNode {
  /** 文件名 xxx.js */
  name: string
  /** 文件元信息 */
  stats: Stats
  /** 遍历的顶层路径 */
  source: string
  /** 文件相对于顶层的路径 */
  offset: string
  /** 文件的绝对路径 */
  current: string
}

/**
 * 深度遍历读取各个文件的信息
 * 注：不会读取文件夹的信息
 */
async function __deepRead__({
  name,
  source,
  offset,
  current,
  filter,
  handler
}: {
  name: string,
  source: string
  offset: string
  current: string
  filter?: (node: DeepReadNode) => (boolean | Promise<boolean>)
  handler: (node: DeepReadNode) => (void | Promise<void>)
}) {
  const stats = statSync(current)
  if (filter) {
    const isContinue = await filter({
      name, offset, source, current, stats
    })
    if (!isContinue) {
      return
    }
  }
  if (stats.isFile()) {
    await handler({ name, offset, source, current, stats })
  } else if (stats.isDirectory()) {
    const files = await readdir(current)
    for (let i = 0; i < files.length; i++) {
      const fileName = files[i]
      await __deepRead__({
        filter,
        handler,
        source,
        name: fileName,
        offset: join(offset, fileName),
        current: resolve(current, fileName),
      })
    }
  }
}

/**
 * 对深度遍历读取做一层封装
 * 屏蔽current、offset等接口
 */
export function deepRead(
  source: string,
  handler: (node: DeepReadNode) => (void | Promise<void>),
  filter?: (node: DeepReadNode) => (boolean | Promise<boolean>)
) {
  if (!existsSync(source)) {
    printExit('read failed: ' + source)
  }
  return __deepRead__({
    source,
    filter,
    handler,
    offset: '',
    current: source,
    name: basename(source),
  })
}

/**
 * 获取json信息
 * 
 * 关于 value：
 * 若传入的值是string，则与relationPath拼接成路径，读取该路径的文件
 *   json: 使用readJSONSync进行读取
 *   js/mjs: 使用require进行读取
 * 若传入的值是object，则原样返回
 * 若是其他值，则返回undefined
 */
export function getJsonSync<T = Record<string,any>>(
  value: any, // 指定传入的值，可以是字符串、对象，或其他值
  strict?: boolean // 是否启用严格模式（一定要有，没有则报错）
): T {
  // 若值是纯对象，则直接返回
  if (isPlainObject(value)) {
    return value
  }
  // 若值不是纯对象，也不是字符串，则返回空对象
  if (!isString(value)) {
    return {} as any
  }
  // 若值是字符串，则判断路径是否存在
  if (!existsSync(value)) {
    if (strict) {
      printExit('not exist: ' + value)
    } else {
      return {} as any
    }
  }
  // 从缓存中读取数据，若没有，则创建数据
  let data: any
  if (/\.json$/.test(value)) {
    data = readJSONSync(value)
  } else if (/\.(js|mjs)$/.test(value)) {
    data = require(value)
  }
  // 判断是否是对象
  if (strict && !isPlainObject(data)) {
    printExit('read failed: ' + value)
  }
  return data || {}
}
