import { Executor } from './executor'
import type { Project } from 'pro/project'
import type { ProjectConfig } from 'pro/project'
import type { ExecutorProps } from './executor'

/**
 * 项目构建器实例化参数
 */
export interface BuilderProps<
  TProject extends Project<string, ProjectConfig<string>>
> extends ExecutorProps<TProject> {}

/**
 * 项目构建器
 */
export abstract class Builder<
  TProject extends Project<string, ProjectConfig<string>>
> extends Executor<TProject> {
  constructor(props: BuilderProps<TProject>) {
    super(props)
  }
}
