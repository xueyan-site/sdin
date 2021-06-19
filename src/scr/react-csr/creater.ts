import Creator, { CreatorProps } from 'exe/creator'
import ReactCSR, { REACT_CSR_TYPE } from 'pro/react-csr'

/**
 * react应用创建器实例化参数
 */
export interface ReactCSRCreaterProps extends CreatorProps<ReactCSR> {}

/**
 * react应用创建器
 */
export default class ReactCSRCreator extends Creator<ReactCSR> {
  constructor(props: ReactCSRCreaterProps) {
    super(props, REACT_CSR_TYPE)
  }

  async main() {
    await this.generateProject()
    this.downloadModules()
    this.downloadModules(this.project.docPath, 'doc')
    this.initializeGitRepository()
  }
}
