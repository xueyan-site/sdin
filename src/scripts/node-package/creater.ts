import ProjectCreator, { ProjectCreatorProps } from 'base/project-creator'
import NodePackage, { NODE_PACKAGE_TYPE } from 'projects/node-package'

/**
 * node包的模版项
 */
export const NODE_PACKAGE_TEMPLATE_OPTIONS: {
  label: string,
  value: string
}[] = [
  {
    label: NODE_PACKAGE_TYPE + ' default template',
    value: NODE_PACKAGE_TYPE
  }
]

/**
 * node包创建器实例化参数
 */
export interface NodePackageCreaterProps extends ProjectCreatorProps<NodePackage> {}

/**
 * node包创建器
 */
export default class NodePackageCreator extends ProjectCreator<NodePackage> {
  constructor(props: NodePackageCreaterProps) {
    super(props, NODE_PACKAGE_TYPE)
  }

  async main() {
    await this.generateProject()
    this.downloadProjectModules()
    this.downloadDocumentModules()
    this.initializeGitRepository()
  }
}
