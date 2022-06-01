import chalk from 'chalk'
import ora from 'ora'
import fse from 'fs-extra'
import { Executor } from './executor'
import { cmdPath } from 'utl/path'
import { deepCopy, getReplaceHandler } from 'utl/write'
import { executeSync } from 'utl/exec'
import type { Project } from 'pro/project'
import type { ProjectConfig } from 'pro/project'
import type { ExecutorProps } from './executor'

export interface CreatorProps<
  P extends Project<string, ProjectConfig<string>>
> extends ExecutorProps<P> {
  /** 实例化项目时，使用的模版名称 */
  template?: string
}

export abstract class Creator<
  P extends Project<string, ProjectConfig<string>>
> extends Executor<P> {

  protected tmp: string

  constructor(props: CreatorProps<P>, defaultTemplate: string) {
    super(props)
    const __template__ = props.template || defaultTemplate
    this.tmp = cmdPath(`pub/tmp/${__template__}`)
  }

  /**
   * 复制项目代码
   */
  protected async generateProject() {
    if (fse.existsSync(this.project.root)) {
      throw Error(`${chalk.yellow(this.project.name)} is already exists`)
    }
    const tip = ora(`${this.project.type} template ${chalk.blue('copying')}\n`).start()
    try {
      await deepCopy(
        this.tmp,
        this.project.root,
        getReplaceHandler(this.project)
      )
      tip.succeed(`${this.project.type} template ${chalk.blue('copied successfully')}`)
    } catch (err) {
      tip.fail(`${this.project.type} node modules ${chalk.red('copy failed')}`)
      console.error(err)
    }
  }

  /**
   * 初始化git仓库
   */
  protected initializeGitRepository() {
    const gitPath = this.project.withRoot('.git')
    if (!fse.existsSync(gitPath)) {
      const tip = ora(`${this.project.name} git repository ${chalk.blue('initializing')}\n`).start()
      try {
        executeSync(`cd ${this.project.root} && git init && git add . && git commit -m "chore: project is created"`)
        tip.succeed(`${this.project.name} git repository ${chalk.blue('initialized successfully')}`)
      } catch (err) {
        tip.fail(`${this.project.name} git repository ${chalk.red('initialization failed')}`)
        console.error(err)
      }
    }
  }
}
