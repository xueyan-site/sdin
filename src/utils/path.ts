import path from 'path'
import os from 'os'

/**
 * 导出path原生的函数，于此处做兼容
 */
export const basename = path.basename

/**
 * 连接路径
 * @param {String[]} pathList 路径
 */
export const withPath = (...pathList: string[]) => {
  return path.resolve(...pathList)
}

/**
 * 连接路径
 * @param {String[]} pathList 路径
 */
export const joinPath = (...pathList: string[]) => {
  return path.join(...pathList)
}

/**
 * 当前工作目录（current working directory）
 */
export const CWD = process.cwd()

/**
 * 基于当前工作目录的相对路径
 * @param {String[]} pathList 路径
 */
export const cwdPath = (...pathList: string[]) => {
  return path.resolve(CWD, ...pathList)
}

/**
 * 基于当前工作目录的node_modules的相对路径
 * @param {String[]} pathList 路径
 */
export const cwdNmPath = (...pathList: string[]) => {
  return path.resolve(CWD, 'node_modules', ...pathList)
}

/**
 * 当前模块目录（current module directory）
 */
export const CMD = path.resolve(__dirname, '../../')

/**
 * 基于当前模块目录的相对路径
 * @param {String[]} pathList 路径
 */
export const cmdPath = (...pathList: string[]) => {
  return path.resolve(CMD, ...pathList)
}

/**
 * 基于当前模块目录的node_modules的相对路径
 * @param {String[]} pathList 路径
 */
export const cmdNmPath = (...pathList: string[]) => {
  return path.resolve(CMD, 'node_modules', ...pathList)
}

/**
 * 当前用户的根目录（current home directory）
 */
export const CHD = os.homedir()

/**
 * 基于当前用户根目录的相对路径
 * @param {String[]} pathList 路径
 */
export const chdPath = (...pathList: string[]) => {
  return path.resolve(CHD, ...pathList)
}

/**
 * 计算path2中引入path1的相对路径
 * @example
 * relativePath('/a/b/c/d/e.js', '/a/b/f/g.js')
 * // result === '../c/d/e.js'
 */
export const relativePath = (path1: string, path2: string) => {
  let path1List = path1.split('/')
  let path2List = path2.split('/')
  const maxLen = Math.max(path1List.length, path2List.length)
  for (let i = 0; i < maxLen; i++) {
    if (path1List[i] !== path2List[i]) {
      path1List = path1List.slice(i)
      path2List = path2List.slice(i)
      break
    }
  }
  let relaPath = ''
  if (path2List.length > 1) {
    relaPath = new Array(path2List.length - 1).fill('../').join('')
  } else {
    relaPath = './'
  }
  return relaPath + path1List.join('/')
}
