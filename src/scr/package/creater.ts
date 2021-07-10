import Creator, { CreatorProps } from 'exe/creator'
import Package, { PACKAGE_TYPE } from 'pro/package'

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
    this.downloadModules(this.project.doc, 'doc')
    this.initializeGitRepository()
  }
}
