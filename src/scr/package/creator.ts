import { Creator } from 'exe/creator'
import { PACKAGE_TYPE } from 'pro/package'
import type { CreatorProps } from 'exe/creator'
import type { Package } from 'pro/package'

/**
 * node包创建器实例化参数
 */
export interface PackageCreatorProps extends CreatorProps<Package> {}

/**
 * node包创建器
 */
export class PackageCreator extends Creator<Package> {
  constructor(props: PackageCreatorProps) {
    super(props, PACKAGE_TYPE)
  }

  async main() {
    await this.generateProject()
    this.downloadModules()
    this.downloadModules(this.project.doc, 'doc')
    this.initializeGitRepository()
  }
}
