import del from 'del'
import ora from 'ora'
import chalk from 'chalk'
import { printExitError, printLoading, printSuccess } from 'utl/print'
import { Builder } from 'exe/builder'
import { compile } from './common/task'
import { precheck } from './common/check'
import type { BuilderProps } from 'exe/builder'
import type { Package } from 'pro/package'

/**
 * 包构建器实例化参数
 */
export interface PackageBuilderProps extends BuilderProps<Package> {}

/**
 * 包构建器
 */
export class PackageBuilder extends Builder<Package> {
  constructor(props: PackageBuilderProps) {
    super(props)
  }

  async main() {
    await del(this.project.dist)
    // 预校验
    printLoading(`checking ${this.project.name}`)
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
      const time = await compile(this.project)
      tip.succeed(`${this.project.name} built ${chalk.blue('successfully')}, total ${chalk.green(time + 'ms')}`)
      console.log()
    } catch (err) {
      tip.fail(`${this.project.name} built ${chalk.red('failed')}`)
      return console.error(err)
    }
  }
}
