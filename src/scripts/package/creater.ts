import Creator, { CreatorProps } from 'executors/creator'
import Package, { PACKAGE_TYPE } from 'projects/package'

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
