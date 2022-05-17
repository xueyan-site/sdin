import { Creator } from 'exe/creator'
import { REACT_CSR_TYPE } from 'pro/react-csr'
import type { CreatorProps } from 'exe/creator'
import type { ReactCSR } from 'pro/react-csr'

/**
 * react应用创建器实例化参数
 */
export interface ReactCSRCreatorProps extends CreatorProps<ReactCSR> {}

/**
 * react应用创建器
 */
export class ReactCSRCreator extends Creator<ReactCSR> {
  constructor(props: ReactCSRCreatorProps) {
    super(props, REACT_CSR_TYPE)
  }

  async main() {
    await this.generateProject()
    this.downloadModules()
    this.downloadModules(this.project.doc, 'doc')
    this.initializeGitRepository()
  }
}
