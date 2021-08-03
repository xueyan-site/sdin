import fse from 'fs-extra'
import { isPlainObject, isString } from 'lodash'
import { withPath } from './path'
import { PackageInfo, AnyObject } from 'types'

/**
 * data cacher
 * we can cache data when we get data
 * 
 * @param getter data getter
 * @param expire data expire time (default: no expire time)
 * @returns new getter with same interface
 */
export function withCache<K,V,P=void>(
  getter: (key: K, props: P) => V,
  expire?: number
) {
  const cache: Map<K, V> = new Map()
  return (key: K, props: P) => {
    let value = cache.get(key)
    if (!value) {
      value = getter(key, props)
      cache.set(key, value)
      if (expire) {
        setTimeout(() => {
          cache.delete(key)
        }, expire)
      }
    }
    return value
  }
}

/**
 * read json information from cache
 */
const getJson = withCache<string, any>(key => {
  let data: any
  if (/\.json$/.test(key)) {
    data = fse.readJSONSync(key)
  } else if (/\.(js|mjs)$/.test(key)) {
    data = require(key)
  }
  return data
}, 2000)

/**
 * read json information
 * 
 * about value:
 * if value type is string, concat relatiion path to new path, read this path
 *   json: use readJSONSync
 *   js/mjs: use nodejs's require
 * if value type is plain object, no change, return this value
 * if other type, return undefined
 * 
 * @param value value，can be string, object, or other type
 * @param root relative path @default ''
 * @param strict open strict mode or not (must send, or throw error)
 */
export function readJsonSync(value: any, root?: string, strict?: boolean): AnyObject {
  if (isPlainObject(value)) {
    return value
  }
  if (!isString(value)) {
    return {}
  }
  const filePath = root ? withPath(root, value) : value
  if (!fse.existsSync(filePath)) {
    if (strict) {
      throw Error(`"${filePath}" does not exist`)
    } else {
      return {}
    }
  }
  const data = getJson(filePath)
  if (strict && !isPlainObject(data)) {
    throw Error(`failed to read "${filePath}", please check whether the file content format is correct`)
  }
  return data || {}
}

/**
 * get package information by folder
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
