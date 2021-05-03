import Project, { ProjectProps, ProjectConfig } from 'base/project'

/**
 * Node应用类型
 */
export type NodeApplicationType = 'node-application'

export const NODE_APPLICATION_TYPE: NodeApplicationType = 'node-application'

/**
 * Node应用配置信息
 */
export interface NodeApplicationConfig extends ProjectConfig<NodeApplicationType> {}

/**
 * Node应用配置信息默认值
 */
export const NODE_APPLICATION_CONFIG: NodeApplicationConfig = {
  type: NODE_APPLICATION_TYPE
}

/**
 * Node应用实例化参数
 */
export interface NodeApplicationProps extends ProjectProps<
  NodeApplicationType, 
  NodeApplicationConfig
> {}

/**
 * Node应用
 */
export default class NodeApplication extends Project<
  NodeApplicationType, 
  NodeApplicationConfig
> {
  constructor(props: NodeApplicationProps) {
    super(props, NODE_APPLICATION_CONFIG)
  }
}
