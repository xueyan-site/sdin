import Project, { ProjectProps, ProjectConfig } from 'projects/project'

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
   * 构建成web端使用的脚本
   */
  buildWeb: boolean

  /**
   * 构建成node端使用的脚本
   */
  buildNode: boolean

  /**
   * 构建成定义文件
   */
  buildTypes: boolean 

  /**
   * 使用react
   */
  useReact: boolean

  /**
   * 开启压缩
   */
  useCompress: boolean

  /**
   * 将多个文件合并于一处
   */
  useMerge: boolean
}

/**
 * 包配置信息默认值
 */
export const PACKAGE_CONFIG: PackageConfig = {
  type: PACKAGE_TYPE,
  buildWeb: true,
  buildNode: true,
  buildTypes: true,
  useReact: false,
  useMerge: false,
  useCompress: false
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
