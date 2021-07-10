import ReactCSR from 'pro/react-csr'
import Starter, { StarterProps } from 'exe/starter'
import { printInfo } from 'utl/print'
import { createServer } from './server'

/**
 * react应用创建器实例化参数
 */
export interface ReactCSRStarterProps extends StarterProps<ReactCSR> {
  /**
   * 是否是测试环境
   */
  test?: boolean

  /**
   * 是否是预发环境
   */
  prev?: boolean
}

/**
 * react应用创建器
 */
export default class ReactCSRStarter extends Starter<ReactCSR> {
  constructor(props: ReactCSRStarterProps) {
    super(props)
  }

  async main() {
    const project = this.project
    const config = project.config
    const server = createServer(this.project)
    return new Promise<void>(resolve => {
      this.on('close', () => {
        server.emit('close')
        resolve()
      })
      server.listen(config.serve.port, () => {
        printInfo(`${project.name} listening on http://127.0.0.1:${config.serve.port}!\n`)
      })
    })
  }
}
