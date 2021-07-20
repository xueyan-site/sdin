import del from 'del'
import ReactCSR from 'pro/react-csr'
import Starter, { StarterProps } from 'exe/starter'
import { printInfo, printLoading, printSuccess } from 'utl/print'
import { createServer } from './server'
import { createWebpack } from './webpack'
import { handleAssets } from '../common/assets'

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
    await del(this.project.dist)
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
    const compiler = await createWebpack(project)
    const server = await createServer(project, compiler)
    return new Promise<void>(resolve => {
      this.on('close', () => {
        server.emit('close')
        resolve()
      })
      server.listen(project.start.port, () => {
        printInfo(`application ${project.name} listening on http://127.0.0.1:${project.start.port}\n`)
      })
    })
  }
}
