import Project, { ProjectProps, ProjectConfig } from 'projects/project'

/**
 * 包类型
 */
export type PackageType = 'package'

export const PACKAGE_TYPE: PackageType = 'package'

/**
 * 包配置信息
 */
export interface PackageConfig extends ProjectConfig<PackageType> {}

/**
 * 包配置信息默认值
 */
export const PACKAGE_CONFIG: PackageConfig = {
  type: PACKAGE_TYPE
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
