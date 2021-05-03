import Project, { ProjectProps, ProjectConfig } from 'base/project'

/**
 * Node包类型
 */
export type NodePackageType = 'node-package'

export const NODE_PACKAGE_TYPE: NodePackageType = 'node-package'

/**
 * Node包配置信息
 */
export interface NodePackageConfig extends ProjectConfig<NodePackageType> {}

/**
 * Node包配置信息默认值
 */
export const NODE_PACKAGE_CONFIG: NodePackageConfig = {
  type: NODE_PACKAGE_TYPE
}

/**
 * Node包实例化参数
 */
export interface NodePackageProps extends ProjectProps<
  NodePackageType, 
  NodePackageConfig
> {}

/**
 * Node包
 */
export default class NodePackage extends Project<
  NodePackageType, 
  NodePackageConfig
> {
  constructor(props: NodePackageProps) {
    super(props, NODE_PACKAGE_CONFIG)
  }
}
