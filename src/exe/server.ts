import Executor from './executor'
import { v4 as uuid } from 'uuid'
import type Project from 'pro/project'
import type { ProjectConfig } from 'pro/project'
import type { ExecutorProps } from './executor'

/**
 * 项目服务器实例化参数
 */
export interface ServerProps<
  TProject extends Project<string, ProjectConfig<string>>
> extends ExecutorProps<TProject> {
  /**
   * 服务器密码
   */
  password?: string
}

/**
 * 项目服务器
 */
export default abstract class Server<
  TProject extends Project<string, ProjectConfig<string>>
> extends Executor<TProject> {
  /**
   * 服务器密码
   */
  password: string

  constructor(props: ServerProps<TProject>) {
    super(props)
    if (props.password) {
      this.password = props.password
    } else {
      this.password = uuid()
    }
  }
}
