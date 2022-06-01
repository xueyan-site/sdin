import { Executor } from './executor'
import { v4 as uuid } from 'uuid'
import type { Project } from 'pro/project'
import type { ProjectConfig } from 'pro/project'
import type { ExecutorProps } from './executor'

export interface ServerProps<
  P extends Project<string, ProjectConfig<string>>
> extends ExecutorProps<P> {
  /** 服务器密码 */
  password?: string
}

export abstract class Server<
  P extends Project<string, ProjectConfig<string>>
> extends Executor<P> {

  password: string

  constructor(props: ServerProps<P>) {
    super(props)
    if (props.password) {
      this.password = props.password
    } else {
      this.password = uuid()
    }
  }
}
