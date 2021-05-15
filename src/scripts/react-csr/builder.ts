import ReactCSR from 'projects/react-csr'
import Builder, { BuilderProps } from 'executors/builder'
import Webpack, { Compiler, Stats } from 'webpack'
import { getWebpackConfig } from './webpack'
import { logInfo } from 'utils/print'
import ora from 'ora'

/**
 * react应用构建器实例化参数
 */
export interface ReactCSRBuilderProps extends BuilderProps<ReactCSR> {
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
 * react应用构建器
 */
export default class ReactCSRBuilder extends Builder<ReactCSR> {
  /**
   * 代码编译器
   */
  readonly compiler: Compiler

  constructor(props: ReactCSRBuilderProps) {
    super(props)
    this.compiler = Webpack(getWebpackConfig(this.project, {
      isDevMode: false,
      isTestEnv: props.isPrevEnv || false,
      isPrevEnv: props.isPrevEnv || false
    }))
  }

  main() {
    this.downloadModules()
    return new Promise<void>((resolve, reject) => {
      const project = this.project
      const config = project.config
      this.on('close', () => {
        this.compiler.close(() => {
          logInfo(`${project.name} server will closed on ${config.servePort}!`)
          resolve()
        })
      })
      const buildOra = ora(`${this.project.name} is building`)
      buildOra.start()
      this.compiler.run((error?: Error, stats?: Stats) => {
        if (error) {
          buildOra.fail(`${this.project.name} build failed!`)
          console.error(error.stack || error)
          reject()
        } else if (stats && stats.hasErrors()) {
          buildOra.fail(`${this.project.name} build failed!`)
          console.error(stats.toString('errors-only'))
          reject()
        } else {
          buildOra.succeed(`${this.project.name} builded successfully!`)
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
