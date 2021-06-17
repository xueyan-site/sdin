import ReactCSR from 'projects/react-csr'
import Builder, { BuilderProps } from 'executors/builder'
import { Compiler, Stats } from 'webpack'
import { createWebpack } from './webpack'
import { printError, printInfo, printLoading, printSuccess } from 'utils/print'

/**
 * react应用构建器实例化参数
 */
export interface ReactCSRBuilderProps extends BuilderProps<ReactCSR> {
  /**
   * 是否是测试环境
   */
  isTestEnv?: boolean
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
    this.compiler = createWebpack(this.project)
  }

  main() {
    return new Promise<void>((resolve, reject) => {
      const project = this.project
      const config = this.project.config
      this.on('close', () => {
        this.compiler.close(() => {
          printInfo(`${project.name} server will closed on ${config.servePort}!`)
          resolve()
        })
      })
      printLoading(`${project.name} is building`)
      this.compiler.run((error?: Error, stats?: Stats) => {
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
