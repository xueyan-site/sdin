import EventEmitter from 'events'
import fse from 'fs-extra'
import ora from 'ora'
import chalk from 'chalk'
import { executeSync } from 'utl/exec'
import type Project from 'pro/project'
import type { ProjectConfig } from 'pro/project'

/**
 * 项目执行器实例化参数
 */
export interface ExecutorProps<
  TProject extends Project<string, ProjectConfig<string>>
> {
  project: TProject
}

/**
 * 项目执行器
 */
export default abstract class Executor<
  TProject extends Project<string, ProjectConfig<string>>
> extends EventEmitter {
  /**
   * 项目对象
   */
  readonly project: TProject

  /**
   * 是否正在执行
   */
  protected executing: boolean

  constructor(props: ExecutorProps<TProject>) {
    super()
    this.project = props.project
    this.executing = false
  }

  /**
   * 执行器的主要任务
   */
  abstract main(): Promise<void>

  /**
   * 专用于执行任务的方法，它可以让任务成为可关闭状态
   */
  protected race<TData>(task: Promise<TData>): Promise<TData|undefined> {
    return Promise.race([
      task,
      new Promise<undefined>(resolve => {
        this.on('close', () => {
          resolve(undefined)
        })
      })
    ])
  }

  /**
   * 开始运行
   */
  async open(): Promise<void> {
    if (!this.executing) {
      try {
        this.executing = true
        this.emit('open')
        await this.race(this.main())
        this.executing = false
        this.removeAllListeners('close')
      } catch (err) {
        this.executing = false
        this.removeAllListeners('close')
        throw err
      }
    }
  }

  /**
   * 终止运行
   */
  close(): void {
    if (this.executing) {
      this.emit('close')
      this.executing = false
      this.removeAllListeners('close')
    }
  }

  /**
   * 下载 node_modules
   */
  protected downloadModules(
    path: string = this.project.root,
    name: string = this.project.name
  ) {
    if (fse.existsSync(path)) {
      const tip = ora(`${name} node modules ${chalk.blue('downloading')}`).start()
      try {
        executeSync(`cd ${path} && npm install`)
        tip.succeed(`${name} node modules ${chalk.blue('downloaded successfully')}`)
      } catch (err) {
        tip.fail(`${name} node modules ${chalk.red('download failed')}`)
        console.error(err)
      }
    }
  }
}
