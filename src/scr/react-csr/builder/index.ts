import del from 'del'
import ReactCSR from 'pro/react-csr'
import Builder, { BuilderProps } from 'exe/builder'
import { printError, printInfo, printLoading, printSuccess } from 'utl/print'
import Webpack, { Stats } from 'webpack'
import { getWebpackConfig } from './webpack'
import { handleAssets } from '../common/assets'

/**
 * react应用构建器实例化参数
 */
export interface ReactCSRBuilderProps extends BuilderProps<ReactCSR> {
  /**
   * 是否是测试环境
   */
  test?: boolean
}

/**
 * react应用构建器
 */
export default class ReactCSRBuilder extends Builder<ReactCSR> {
  constructor(props: ReactCSRBuilderProps) {
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
    const options = await getWebpackConfig(project)
    const compiler = Webpack(options)
    return new Promise<void>((resolve, reject) => {
      this.on('close', () => {
        compiler.close(() => {
          printInfo(`${project.name} build process is closed`)
          resolve()
        })
      })
      compiler.run((error?: Error, stats?: Stats) => {
        if (error) {
          printError(error)
          reject()
        } else if (stats && stats.hasErrors()) {
          printError(stats.toString('errors-only'))
          reject()
        } else {
          printSuccess(`${project.name} was built successfully!`)
          if (stats) {
            console.log(stats.toString({
              all: false,
              colors: true,
              version: true,
              timings: true,
              builtAt: true,
              assets: true,
              children: true,
              warnings: true
            }))
          }
          resolve()
        }
      })
    })
  }
}
