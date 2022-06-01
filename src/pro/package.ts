import { isBoolean } from 'lodash'
import { Project } from './project'
import type { ProjectProps, ProjectConfig } from './project'

export type PackageType = 'package'

export const PACKAGE_TYPE: PackageType = 'package'

export interface PackageConfig extends ProjectConfig<PackageType> {
  /** 构建出web端使用的脚本 */
  buildWeb?: boolean
  /** 构建出node端使用的脚本 */
  buildNode?: boolean
  /** 构建出定义文件 */
  buildTypes?: boolean 
  /** 构建出完全独立的单文件Web版本（会包含node_modules中引入的包）*/
  // buildMinWeb: false | {}
  /** 构建出完全独立的单文件Node版本（会包含node_modules中引入的包）*/
  // buildMinNode: false | {}
  /** 使用react */
  useReact?: boolean
  /** 混淆代码 */
  useUglify?: boolean
}

export interface PackageProps extends ProjectProps<
  PackageType, 
  PackageConfig
> {}

export class Package extends Project<
  PackageType, 
  PackageConfig
> {

  readonly buildWeb: boolean

  readonly buildNode: boolean

  readonly buildTypes: boolean 

  readonly useReact: boolean

  readonly useUglify: boolean
  
  constructor(props: PackageProps) {
    super(PACKAGE_TYPE, props)
    const config = this.config
    this.buildWeb = isBoolean(config.buildWeb) ? config.buildWeb : true
    this.buildNode = isBoolean(config.buildNode) ? config.buildNode : true
    this.buildTypes = isBoolean(config.buildTypes) ? config.buildTypes : true
    this.useReact = isBoolean(config.useReact) ? config.useReact : false
    this.useUglify = isBoolean(config.useUglify) ? config.useUglify : false
  }
}
