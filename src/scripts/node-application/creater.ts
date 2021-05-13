import ProjectCreator, { ProjectCreatorProps } from 'base/project-creator'
import NodeApplication, { NODE_APPLICATION_TYPE } from 'projects/node-application'

/**
 * node应用的模版项
 */
export const NODE_APPLICATION_TEMPLATE_OPTIONS: {
  label: string,
  value: string
}[] = [
  {
    label: NODE_APPLICATION_TYPE + ' default template',
    value: NODE_APPLICATION_TYPE
  }
]

/**
 * node应用创建器实例化参数
 */
export interface NodeApplicationCreaterProps extends ProjectCreatorProps<NodeApplication> {}

/**
 * node应用创建器
 */
export default class NodeApplicationCreator extends ProjectCreator<NodeApplication> {
  constructor(props: NodeApplicationCreaterProps) {
    super(props, NODE_APPLICATION_TYPE)
  }

  async main() {
    await this.generateProject()
    this.downloadModules()
    this.downloadModules(this.project.docPath, 'doc')
    this.initializeGitRepository()
  }
}
