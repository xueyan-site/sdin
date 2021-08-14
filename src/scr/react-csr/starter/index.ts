import ora from 'ora'
import chalk from 'chalk'
import Starter from 'exe/starter'
import { printExitError, printLoading, printSuccess } from 'utl/print'
import { createServer } from './server'
import { createWebpack } from './webpack'
import { precheck } from '../common/check'
import type ReactCSR from 'pro/react-csr'
import type { StarterProps } from 'exe/starter'

/**
 * react应用创建器实例化参数
 */
export interface ReactCSRStarterProps extends StarterProps<ReactCSR> {}

/**
 * react应用创建器
 */
export default class ReactCSRStarter extends Starter<ReactCSR> {
  constructor(props: ReactCSRStarterProps) {
    super(props)
  }

  async main() {
    // 预校验
    printLoading(`checking project ${this.project.name}`)
    const checkResult = await precheck(this.project)
    if (checkResult) {
      return printExitError(checkResult)
    } else {
      printSuccess(`${this.project.name} has no questions`)
    }
    // 启动服务器
    console.log()
    let server: any
    const tip = ora(`${this.project.name} compiler ${chalk.blue('creating')}`).start()
    try {
      const compiler = await createWebpack(this.project)
      server = await createServer(this.project, compiler)
      tip.succeed(`${this.project.name} compiler created ${chalk.blue('successfully')}`)
    } catch (err) {
      tip.fail(`${this.project.name} compiler created ${chalk.red('failed')}`)
      return console.error(err)
    }
    if (server) {
      server.listen(this.project.start.port, () => {
        ora(`${this.project.name} compiler listening on ${
          chalk.blue('http://127.0.0.1:' + this.project.start.port)
        }\n`).succeed()
      })
      return new Promise<void>(resolve => {
        this.on('close', () => {
          server.emit('close')
          resolve()
        })
      })
    }
  }
}
