import Project, { ProjectProps, ProjectConfig } from 'base/project'

/**
 * react包类型
 */
export type ReactPackageType = 'react-package'

export const REACT_PACKAGE_TYPE: ReactPackageType = 'react-package'

/**
 * react包配置信息
 */
export interface ReactPackageConfig extends ProjectConfig<ReactPackageType> {}

/**
 * react包配置信息默认值
 */
export const REACT_PACKAGE_CONFIG: ReactPackageConfig = {
  type: REACT_PACKAGE_TYPE
}

/**
 * react包实例化参数
 */
export interface ReactPackageProps extends ProjectProps<
  ReactPackageType, 
  ReactPackageConfig
> {}

/**
 * react包
 */
export default class ReactPackage extends Project<
  ReactPackageType, 
  ReactPackageConfig
> {
  constructor(props: ReactPackageProps) {
    super(props, REACT_PACKAGE_CONFIG)
  }
}
