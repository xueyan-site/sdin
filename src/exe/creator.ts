import fse from 'fs-extra'
import Project, { ProjectConfig } from 'pro/project'
import Executor, { ExecutorProps } from './executor'
import { printLoading, printSuccess } from 'utl/print'
import { cmdPath } from 'utl/path'
import { deepCopy, getReplaceHandler } from 'utl/write'
import { executeSync } from 'utl/exec'

/**
 * 项目创建器实例化参数
 */
export interface CreatorProps<
  TProject extends Project<string, ProjectConfig<string>>
> extends ExecutorProps<TProject> {
  /**
   * 实例化项目时，使用的模版名称
   */
  template?: string
}

/**
 * 项目创建器
 */
export default abstract class Creator<
  TProject extends Project<string, ProjectConfig<string>>
> extends Executor<TProject> {
  protected templatePath: string

  constructor(props: CreatorProps<TProject>, defaultTemplate: string) {
    super(props)
    const __template__ = props.template || defaultTemplate
    this.templatePath = cmdPath(`tmp/${__template__}`)
  }

  /**
   * 复制项目代码
   */
  protected async generateProject() {
    if (fse.existsSync(this.project.root)) {
      throw Error(`project ${this.project.name} is already exists`)
    }
    printLoading('copying project template')
    await deepCopy(
      this.templatePath,
      this.project.root,
      getReplaceHandler(this.project)
    )
    printSuccess('copy project template successfully')
  }

  /**
   * 初始化git仓库
   */
  protected initializeGitRepository() {
    const gitPath = this.project.withRoot('.git')
    if (!fse.existsSync(gitPath)) {
      printLoading('initializing git repository')
      executeSync(`cd ${this.project.root} && git init && git add . && git commit -m "chore: project created"`)
    }
  }
}
