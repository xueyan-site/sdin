import del from 'del'
import gulp from 'gulp'
import ora from 'ora'
import chalk from 'chalk'
import { printExitError, printLoading, printSuccess } from 'utl/print'
import Starter from 'exe/starter'
import { compile } from './common/task'
import { precheck } from './common/check'
import type Package from 'pro/package'
import type { StarterProps } from 'exe/starter'

/**
 * 包构建器实例化参数
 */
export interface PackageStarterProps extends StarterProps<Package> {}

/**
 * 包构建器
 */
export default class PackageStarter extends Starter<Package> {
  constructor(props: PackageStarterProps) {
    super(props)
  }

  async main() {
    await del(this.project.dist)
    // 预校验
    printLoading(`checking project ${this.project.name}`)
    const checkResult = await precheck(this.project)
    if (checkResult) {
      return printExitError(checkResult)
    } else {
      printSuccess(`${this.project.name} has no questions`)
    }
    // 正式开始构建（首次构建）
    console.log()
    const tip = ora(`${this.project.name} ${chalk.blue('building')}`).start()
    try {
      const time = await compile(this.project)
      tip.succeed(`${this.project.name} built ${chalk.blue('successfully')}, total ${chalk.green(time + 'ms')}`)
    } catch (err) {
      tip.fail(`${this.project.name} built ${chalk.red('failed')}`)
      return console.error(err)
    }
    // 处理文件变动的方法
    const handleFileModify = (path: string) => {
      const pathDesc = 'src/' + path
      const tip = ora(`${pathDesc} ${chalk.blue('rebuilding')}`).start()
      compile(this.project, file => file.path.includes(path)).then(time => {
        tip.succeed(`${pathDesc} rebuilt ${chalk.blue('successfully')}, total ${chalk.green(time + 'ms')}`)
      }).catch(err => {
        tip.fail(`${pathDesc} rebuilt ${chalk.red('failed')}`)
        console.error(err)
      })
    }
    // 执行watch相关逻辑
    const watcher = gulp.watch('**/*', { cwd: this.project.src })
    watcher.on('addDir', handleFileModify)
    watcher.on('change', handleFileModify)
    return new Promise<void>(resolve => {
      this.on('close', () => {
        watcher.close()
        resolve()
      })
    })
  }
}
