import Project, { ProjectConfig } from 'pro/project'
import Executor, { ExecutorProps } from './executor'

/**
 * 项目服务器实例化参数
 */
export interface ServerProps<
  TProject extends Project<string, ProjectConfig<string>>
> extends ExecutorProps<TProject> {}

/**
 * 项目服务器
 */
export default abstract class Server<
  TProject extends Project<string, ProjectConfig<string>>
> extends Executor<TProject> {
  constructor(props: ServerProps<TProject>) {
    super(props)
  }
}