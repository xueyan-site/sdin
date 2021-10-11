import ora from 'ora'
import chalk from 'chalk'
import Server from 'exe/server'
import { createServer } from './server'
import type ReactCSR from 'pro/react-csr'
import type { ServerProps } from 'exe/server'

/**
 * react应用服务器实例化参数
 */
export interface ReactCSRServerProps extends ServerProps<ReactCSR> {}

/**
 * react应用服务器
 */
export default class ReactCSRServer extends Server<ReactCSR> {
  constructor(props: ReactCSRServerProps) {
    super(props)
  }

  async main() {
    const project = this.project
    // 启动服务器
    console.log()
    const server = await createServer(this.project, {
      password: this.password
    })
    return new Promise<void>(resolve => {
      this.on('close', () => {
        server.emit('close')
        resolve()
      })
      server.listen(project.serve.port, () => {
        ora(`${project.name} server password is ${this.password}`).info()
        ora(`${project.name} server listening on ${
          chalk.blue('http://127.0.0.1:' + project.serve.port + project.publicPath)
        }\n`).succeed()
      })
    })
  }
}
