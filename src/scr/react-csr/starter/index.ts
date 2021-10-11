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
    const project = this.project
    // 预校验
    printLoading(`checking project ${project.name}`)
    const checkResult = await precheck(project)
    if (checkResult) {
      return printExitError(checkResult)
    } else {
      printSuccess(`${project.name} has no questions`)
    }
    // 启动服务器
    console.log()
    let server: any
    const tip = ora(`${project.name} compiler ${chalk.blue('creating')}`).start()
    try {
      const compiler = await createWebpack(project)
      server = await createServer(project, compiler)
      tip.succeed(`${project.name} compiler created ${chalk.blue('successfully')}`)
    } catch (err) {
      tip.fail(`${project.name} compiler created ${chalk.red('failed')}`)
      return console.error(err)
    }
    if (server) {
      server.listen(project.start.port, () => {
        ora(`${project.name} compiler listening on ${
          chalk.blue('http://127.0.0.1:' + project.start.port + project.publicPath)
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
