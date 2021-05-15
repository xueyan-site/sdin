import Creator, { CreatorProps } from 'executors/creator'
import Package, { PACKAGE_TYPE } from 'projects/package'

/**
 * node包的模版项
 */
export const PACKAGE_TEMPLATE_OPTIONS: {
  label: string,
  value: string
}[] = [
  {
    label: PACKAGE_TYPE + ' default template',
    value: PACKAGE_TYPE
  }
]

/**
 * node包创建器实例化参数
 */
export interface PackageCreaterProps extends CreatorProps<Package> {}

/**
 * node包创建器
 */
export default class PackageCreator extends Creator<Package> {
  constructor(props: PackageCreaterProps) {
    super(props, PACKAGE_TYPE)
  }

  async main() {
    await this.generateProject()
    this.downloadModules()
    this.downloadModules(this.project.docPath, 'doc')
    this.initializeGitRepository()
  }
}
