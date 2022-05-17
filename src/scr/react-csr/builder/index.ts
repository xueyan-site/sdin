import del from 'del'
import ora from 'ora'
import chalk from 'chalk'
import { Builder } from 'exe/builder'
import { printExitError, printLoading, printSuccess } from 'utl/print'
import { createWebpack } from './webpack'
import { handleAssets } from '../common/task'
import { precheck } from '../common/check'
import type { ReactCSR } from 'pro/react-csr'
import type { Stats } from 'webpack'
import type { BuilderProps } from 'exe/builder'

/**
 * react应用构建器实例化参数
 */
export interface ReactCSRBuilderProps extends BuilderProps<ReactCSR> {}

/**
 * react应用构建器
 */
export class ReactCSRBuilder extends Builder<ReactCSR> {
  constructor(props: ReactCSRBuilderProps) {
    super(props)
  }

  async main() {
    const project = this.project
    await del(project.dist)
    await del(project.withBuf('entry'))
    // 预校验
    printLoading(`checking ${project.name}`)
    const checkResult = await precheck(project)
    if (checkResult) {
      return printExitError(checkResult)
    } else {
      printSuccess(`${project.name} has no questions`)
    }
    // 正式开始构建
    console.log()
    try {
      await handleAssets(project)
      const stats = await this.compile()
      ora(`${project.name} built ${chalk.blue('successfully')}`).succeed()
      if (stats) {
        console.log(stats.toString({
          all: false,
          colors: true,
          version: true,
          timings: true,
          builtAt: true,
          assets: true,
          children: true,
          warnings: true,
          errors: true
        }))
      }
      console.log()
    } catch (err) {
      ora(`${project.name} built ${chalk.red('failed')}`).fail()
      return console.error(err)
    }
  }

  /**
   * 编译脚本文件
   */
  protected async compile() {
    const project = this.project
    const compiler = await createWebpack(project)
    return new Promise<Stats|undefined>((resolve, reject) => {
      this.on('close', () => {
        compiler.close(() => {
          reject(`${project.name} build process is closed`)
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
