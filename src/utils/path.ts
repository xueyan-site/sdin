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
