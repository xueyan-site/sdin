import { Executor } from './executor'
import type { Project } from 'pro/project'
import type { ProjectConfig } from 'pro/project'
import type { ExecutorProps } from './executor'

/**
 * 项目启动器实例化参数
 */
export interface StarterProps<
  TProject extends Project<string, ProjectConfig<string>>
> extends ExecutorProps<TProject> {}

/**
 * 项目启动器
 */
export abstract class Starter<
  TProject extends Project<string, ProjectConfig<string>>
> extends Executor<TProject> {
  constructor(props: StarterProps<TProject>) {
    super(props)
  }
}
