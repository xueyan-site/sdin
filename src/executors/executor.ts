import EventEmitter from 'events'
import fse from 'fs-extra'
import { printLoading, printSuccess } from 'utils/print'
import { executeSync } from 'utils/exec'
import Project, { ProjectConfig } from 'projects/project'

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
   * 下载 node_modules
   */
  protected downloadModules(
    path: string = this.project.path,
    name: string = this.project.name
  ) {
    if (fse.existsSync(path)) {
      const __name__ = name && (name + ' ')
      printLoading(`downloading ${__name__}node modules`)
      executeSync(`cd ${path} && yarn`)
      printSuccess(`downloaded ${__name__}node modules successfully`)
    }
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
}
