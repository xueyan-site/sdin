import chalk from 'chalk'
import ReactCSR from 'pro/react-csr'
import Server, { ServerProps } from 'exe/server'
import { createServer } from './server'

/**
 * react应用创建器实例化参数
 */
export interface ReactCSRServerProps extends ServerProps<ReactCSR> {}

/**
 * react应用创建器
 */
export default class ReactCSRServer extends Server<ReactCSR> {
  constructor(props: ReactCSRServerProps) {
    super(props)
  }

  async main() {
    const project = this.project
    const server = createServer(this.project)
    return new Promise<void>(resolve => {
      this.on('close', () => {
        server.emit('close')
        resolve()
      })
      server.listen(project.serve.port, () => {
        console.log(`${this.project.name} server listening on ${
          chalk.blue('http://127.0.0.1:' + this.project.serve.port)
        }\n`)
      })
    })
  }
}
