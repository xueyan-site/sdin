import { execSync } from 'child_process'
import fse, { Stats } from 'fs-extra'
import { isPlainObject, isString, set as setByPath } from 'lodash'
import { withPath, joinPath, basename } from './path'
import { PackageInfo, GitInfo, AnyObject } from 'types'

/**
 * 深度遍历的节点信息
 */
export interface DeepReadNode {
  name: string,
  stats: Stats,
  source: string,
  offset: string,
  current: string,
}

/**
 * 深度遍历读取各个文件的信息
 * 注：不会读取文件夹的信息
 * @param param0 
 * @private
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
  const stats = fse.statSync(current)
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
    const files = await fse.readdir(current)
    for (let i = 0; i < files.length; i++) {
      const fileName = files[i]
      await __deepRead__({
        filter,
        handler,
        source,
        name: fileName,
        offset: joinPath(offset, fileName),
        current: withPath(current, fileName),
      })
    }
  }
}

/**
 * 对深度遍历读取做一层封装
 * 屏蔽current、offset等接口
 * @param param0 
 */
export function deepRead(
  source: string,
  handler: (node: DeepReadNode) => (void | Promise<void>),
  filter?: (node: DeepReadNode) => (boolean | Promise<boolean>)
) {
  if (!fse.existsSync(source)) {
    throw Error(`failed to read "${source}", please check whether the file is exists`)
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
 * json信息缓存
 */
const jsonCache: Map<string, AnyObject> = new Map()

/**
 * 从缓存中读取json信息
 */
function getJsonFromCache(key: string, creatJson: () => object) {
  let data: any = jsonCache.get(key)
  if (data) {
    return data
  }
  data = creatJson()
  jsonCache.set(key, data)
  setTimeout(() => {
    jsonCache.delete(key)
  }, 2000)
  return data
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
 * 
 * @param value 指定传入的值，可以是字符串、对象，或其他值
 * @param root 指定文件的参考目录 @default ''
 * @param strict 是否启用严格模式（一定要有，没有则报错）
 */
export function readJsonSync(value: any, root?: string, strict?: boolean): AnyObject {
  // 若值是纯对象，则直接返回
  if (isPlainObject(value)) {
    return value
  }
  // 若值不是纯对象，也不是字符串，则返回空对象
  if (!isString(value)) {
    return {}
  }
  // 若值是字符串，则拼接路径，并判断路径是否存在
  const filePath = root ? withPath(root, value) : value
  if (!fse.existsSync(filePath)) {
    if (strict) {
      throw Error(`"${filePath}" does not exist`)
    } else {
      return {}
    }
  }
  // 从缓存中读取数据，若没有，则创建数据
  return getJsonFromCache(filePath, () => {
    // 读取文件中的数据
    let data: any
    if (/\.json$/.test(filePath)) {
      data = fse.readJSONSync(filePath)
    } else if (/\.(js|mjs)$/.test(filePath)) {
      data = require(filePath)
    }
    // 判断是否是对象
    if (strict && !isPlainObject(data)) {
      throw Error(`failed to read "${filePath}", please check whether the file content format is correct`)
    }
    return data || {}
  })
}

/**
 * 获取git全局配置信息
 */
export function readGitConfigSync(): GitInfo {
  const configStr = execSync(`git config --global --list`).toString()
  const config: AnyObject = {}
  configStr.split('\n').forEach(line => {
    if (line) {
      const flagIndex = line.indexOf('=')
      if (flagIndex > 0) {
        setByPath(config, line.slice(0, flagIndex), line.slice(flagIndex + 1))
      }
    }
  })
  if (!config.user || !config.user.name || !config.user.email) {
    throw Error('please config git global user name and email')
  }
  return config as GitInfo
}

/**
 * 根据文件夹目录，获取包的信息
 * @param {String} dirPath 指定文件夹目录
 */
export function readPackageInfoSync(projectPath: string): PackageInfo {
  const packageInfo = readJsonSync('package.json', projectPath, true)
  const author = packageInfo.author
  if (typeof author === 'object') {
    packageInfo.author = author.name || ''
    if (author.email) {
      packageInfo.author += ' <' + author.email + '>'
    }
  }
  if (!packageInfo.name || !packageInfo.version || !packageInfo.author) {
    throw Error('package.json must contain "name", "version", "author" fields')
  }
  return packageInfo as PackageInfo
}
