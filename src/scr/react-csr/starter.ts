import Starter, { StarterProps } from 'exe/starter'
import ReactCSR from 'pro/react-csr'
import Webpack, { Compiler } from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { getWebpackConfig, getWebpackDevServerConfig } from './__webpack__'
import { printSuccess, printInfo } from 'utl/print'

/**
 * react应用创建器实例化参数
 */
export interface ReactCSRStarterProps extends StarterProps<ReactCSR> {
  /**
   * 是否是测试环境
   */
  isTestEnv?: boolean
  /**
   * 是否是预发环境
   */
  isPrevEnv?: boolean
}

/**
 * react应用创建器
 */
export default class ReactCSRStarter extends Starter<ReactCSR> {
  /**
   * 代码编译器
   */
  readonly compiler: Compiler

  /**
   * 服务器
   */
  readonly server: WebpackDevServer

  constructor(props: ReactCSRStarterProps) {
    super(props)
    this.compiler = Webpack(getWebpackConfig(this.project, {
      isDevMode: true,
      isTestEnv: props.isPrevEnv || false
    }))
    this.server = new WebpackDevServer(
      this.compiler as any,
      getWebpackDevServerConfig(this.project)
    )
  }

  async main() {
    return new Promise<void>(resolve => {
      const project = this.project
      const config = project.config
      this.on('close', () => {
        this.server.close(() => {
          printInfo(`${project.name} server will closed on ${config.startPort}!`)
          resolve()
        })
      })
      this.server.listen(config.startPort, () => {
        printSuccess(`${project.name} listening on http://127.0.0.1:${config.startPort}!\n`)
      })
    })
  }
}
