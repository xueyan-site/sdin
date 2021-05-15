import ora from 'ora'
import del from 'del'
import gulp from 'gulp'
import Package from 'projects/package'
import Builder, { BuilderProps } from 'executors/builder'

/**
 * 包构建器实例化参数
 */
export interface PackageBuilderProps extends BuilderProps<Package> {
  /**
   * 是否监视源文件变化（当原数据更改时会触发重新构建）
   */
  watch?: boolean
}

/**
 * 包构建器
 */
export default class PackageBuilder extends Builder<Package> {
  private watch: boolean

  constructor(props: PackageBuilderProps) {
    super(props)
    this.watch = props.watch || false
  }

  async main() {
    this.downloadModules()
    await del(this.project.distPath)
    await this.compile()
    if (this.watch) {
      const watcher = gulp.watch(this.srcGlob, {
        cwd: this.project.path
      }, () => this.compile())
      this.on('close', () => watcher.close())
      return new Promise<void>(resolve => {
        watcher.on('close', resolve)
      })
    }
  }

  /**
   * 编译
   */
  private async compile() {
    const buildOra = ora(`${this.project.name} is building`)
    buildOra.start()
    try {
      await this.copyFiles()
      await this.compileTypes()
      await this.compileScripts({ target: 'web' })
      await this.compileScripts({ target: 'node' })
      buildOra.succeed(`${this.project.name} builded successfully!`)
    } catch (err) {
      buildOra.fail(`${this.project.name} build failed!`)
      console.error(err)
    }
  }
}
