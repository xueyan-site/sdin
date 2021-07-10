import Project, { ProjectProps, ProjectConfig } from './project'

/**
 * 包类型
 */
export type PackageType = 'package'

export const PACKAGE_TYPE: PackageType = 'package'

/**
 * 包配置信息
 */
export interface PackageConfig extends ProjectConfig<PackageType> {
  /**
   * 构建出web端使用的脚本
   */
  buildWeb: boolean

  /**
   * 构建出node端使用的脚本
   */
  buildNode: boolean

  /**
   * 构建出定义文件
   */
  buildTypes: boolean 

  /**
   * 构建出完全独立的单文件Web版本（会包含node_modules中引入的包）
   */
  // buildMinWeb: false | {}

  /**
   * 构建出完全独立的单文件Node版本（会包含node_modules中引入的包）
   */
  // buildMinNode: false | {}

  /**
   * 使用react
   */
  useReact: boolean

  /**
   * 混淆代码
   */
   useUglify: boolean
}

/**
 * 包配置信息默认值
 */
export const PACKAGE_CONFIG: PackageConfig = {
  type: PACKAGE_TYPE,
  name: '',
  buildWeb: true,
  buildNode: true,
  buildTypes: true,
  // buildMinWeb: false,
  // buildMinNode: false,
  useReact: false,
  useUglify: false
}

/**
 * 包实例化参数
 */
export interface PackageProps extends ProjectProps<
  PackageType, 
  PackageConfig
> {}

/**
 * 包
 */
export default class Package extends Project<
  PackageType, 
  PackageConfig
> {
  constructor(props: PackageProps) {
    super(props, PACKAGE_CONFIG)
  }
}
