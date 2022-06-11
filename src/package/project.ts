import { resolve } from 'path'
import { isBoolean } from 'lodash'
import { printExit } from '../utils/console'
import { getJsonSync } from '../utils/read'
import type { PackageInfo } from '../utils/package'

export interface PackageProjectConfig {
  /** 项目类型 */
  type: 'package'
  /** 项目标识（即包名）*/
  id: string
  /** 项目名称（中文、英文都可以）*/
  name: string
  /** 
   * 模块的alias
   * webpack.resolve.alias | babel-plugin-module-resolver.alias
   * <https://webpack.docschina.org/configuration/resolve/#resolvealias>
   * <https://github.com/tleunen/babel-plugin-module-resolver/blob/master/DOCS.md>
   */
  alias: Record<string, string>
  /** 构建出web端使用的脚本 */
  buildWeb: boolean
  /** 构建出node端使用的脚本 */
  buildNode: boolean
  /** 构建出定义文件 */
  buildTypes: boolean 
  /** 构建出完全独立的单文件Web版本（会包含node_modules中引入的包）*/
  // buildMinWeb: false | {}
  /** 构建出完全独立的单文件Node版本（会包含node_modules中引入的包）*/
  // buildMinNode: false | {}
  /** 使用react */
  useReact: boolean
  /** 混淆代码 */
  useUglify: boolean
}

export interface PackageProjectUserConfig {
  type: 'package'
  name?: string
  alias?: Record<string, string>
  buildWeb?: boolean
  buildNode?: boolean
  buildTypes?: boolean 
  useReact?: boolean
  useUglify?: boolean
}

function getUserConfigSync(root: string): PackageProjectUserConfig {
  const ucfg = getJsonSync(resolve(root, 'project.js'), true)
  if (ucfg.type !== 'package') {
    printExit('project config file format error')
  }
  return ucfg as any
}

export function getPackageProjectConfigSync(
  root: string, 
  pkg: PackageInfo
): PackageProjectConfig {
  const ucfg = getUserConfigSync(root)
  return {
    type: 'package',
    id: pkg.name,
    name: ucfg.name || pkg.name,
    alias: ucfg.alias || {},
    buildWeb: isBoolean(ucfg.buildWeb) ? ucfg.buildWeb : true,
    buildNode: isBoolean(ucfg.buildNode) ? ucfg.buildNode : true,
    buildTypes: isBoolean(ucfg.buildTypes) ? ucfg.buildTypes : true,
    useReact: isBoolean(ucfg.useReact) ? ucfg.useReact : false,
    useUglify: isBoolean(ucfg.useUglify) ? ucfg.useUglify : false,
  }
}
