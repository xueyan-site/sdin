import del from 'del'
import ora from 'ora'
import chalk from 'chalk'
import ReactCSR from 'pro/react-csr'
import Builder, { BuilderProps } from 'exe/builder'
import { printExitError, printLoading, printSuccess } from 'utl/print'
import { Stats } from 'webpack'
import { createWebpack } from './webpack'
import { handleAssets } from '../common/task'
import { precheck } from '../common/check'

/**
 * react应用构建器实例化参数
 */
export interface ReactCSRBuilderProps extends BuilderProps<ReactCSR> {}

/**
 * react应用构建器
 */
export default class ReactCSRBuilder extends Builder<ReactCSR> {
  constructor(props: ReactCSRBuilderProps) {
    super(props)
  }

  async main() {
    await del(this.project.dist)
    await del(this.project.withBuf('entry'))
    // 预校验
    printLoading(`checking project ${this.project.name}`)
    const checkResult = await precheck(this.project)
    if (checkResult) {
      return printExitError(checkResult)
    } else {
      printSuccess(`${this.project.name} has no questions`)
    }
    // 正式开始构建
    console.log()
    const tip = ora(`${this.project.name} ${chalk.blue('building')}`).start()
    try {
      await handleAssets(this.project)
      const stats = await this.compile()
      tip.succeed(`${this.project.name} built ${chalk.blue('successfully')}`)
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
      console.log()
    } catch (err) {
      tip.fail(`${this.project.name} built ${chalk.red('failed')}`)
      return console.error(err)
    }
  }

  /**
   * 编译脚本文件
   */
  protected async compile() {
    const compiler = await createWebpack(this.project)
    return new Promise<Stats|undefined>((resolve, reject) => {
      this.on('close', () => {
        compiler.close(() => {
          reject(`${this.project.name} build process is closed`)
        })
      })
      compiler.run((error?: Error, stats?: Stats) => {
        if (error) {
          reject(error)
        } else if (stats && stats.hasErrors()) {
          reject(stats.toString('errors-only'))
        } else {
          resolve(stats)
        }
      })
    })
  }
}
