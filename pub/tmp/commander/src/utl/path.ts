import path from 'path'
import os from 'os'
import fse from 'fs-extra'

/**
 * computed path from another path
 */
export const basename = path.basename

/**
 * concat path (resolve from root)
 */
export const withPath = path.resolve

/**
 * concat path (join paths)
 */
export const joinPath = path.join

/**
 * current working directory
 */
export const CWD = process.cwd()

/**
 * computed path from CWD
 */
export const cwdPath = (...pathList: string[]) => {
  return path.resolve(CWD, ...pathList)
}

/**
 * computed path from CWD/node_modules
 */
export const cwdNmPath = (...pathList: string[]) => {
  return path.resolve(CWD, 'node_modules', ...pathList)
}

/**
 * current module directory
 */
export const CMD = path.resolve(__dirname, '../../../')

/**
 * computed path from CMD
 */
export const cmdPath = (...pathList: string[]) => {
  return path.resolve(CMD, ...pathList)
}

/**
 * computed path from CMD/node_modules
 */
export const cmdNmPath = (...pathList: string[]) => {
  return path.resolve(CMD, 'node_modules', ...pathList)
}

/**
 * current home directory
 */
export const CHD = os.homedir()

/**
 * computed path from CHD
 */
export const chdPath = (...pathList: string[]) => {
  return path.resolve(CHD, ...pathList)
}

/**
 * exist file in folder or not
 * 
 * resolvePathExtends('/path/to', 'index', ['.tsx', '.ts', '.jsx', '.js'])
 */
export function resolvePathExtends(path: string, name: string, exts: string[]) {
  for (let i = 0; i < exts.length; i++) {
    const currPath = withPath(path, name + exts[i])
    if (fse.existsSync(currPath)) {
      return currPath
    }
  }
  return ''
}

/***********************************************
 * 以下方法，均以 / 为分割符，不因系统不同而不同
 **********************************************/

/**
 * 连接路径
 * @param {String[]} pathList 路径
 */
export const withPosixPath = path.posix.resolve

/**
 * 连接路径
 * @param {String[]} pathList 路径
 */
export const joinPosixPath = path.posix.join

/**
 * computed relative path from another path
 * 
 * @example
 * relativePath('/a/b/c/d/e.js', '/a/b/f/g.js')
 * // result === '../c/d/e.js'
 */
export const relativePosixPath = path.posix.relative
