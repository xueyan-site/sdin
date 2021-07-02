import del from 'del'
import Webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import ReactCSR from 'pro/react-csr'
import Starter, { StarterProps } from 'exe/starter'
import { printError, printInfo, printLoading, printSuccess } from 'utl/print'
import { getServerConfig } from './server'
import { getWebpackConfig } from './webpack'
import { handleAssets } from '../common/assets'

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
    await del(this.project.distPath)
    printLoading(`project ${this.project.name} is being built`)
    await handleAssets(this.project)
    await this.scriptTask()
    return printSuccess(`project ${this.project.name} has been built successfully`)
  }

  /**
   * 处理脚本文件
   */
  protected async scriptTask() {
    const project = this.project
    const config = project.config
    const { serve } = config
    const options = await getWebpackConfig(project)
    const compiler = Webpack(options)
    const serverOptions = getServerConfig(project)
    const server = new WebpackDevServer(compiler as any, serverOptions)
    return new Promise<void>((resolve, reject) => {
      this.on('close', () => {
        server.close(() => {
          printInfo(`${project.name} server will closed on ${serve.port}!`)
          resolve()
        })
      })
      server.listen(serve.port, error => {
        if (error) {
          printError(`${project.name} server has an exception`)
          console.log(error)
          reject()
        } else {
          printSuccess(`${project.name} listening on http://127.0.0.1:${serve.port}!\n`)
        }
      })
    })
  }
}
