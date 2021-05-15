import ora from 'ora'
import del from 'del'
import { src, dest, watch } from 'gulp'
import filter from 'gulp-filter'
import babel from 'gulp-babel'
import uglify from 'gulp-uglify'
import { Options as BabelPresetEnvOpts } from '@babel/preset-env'
import NodeApplication from 'projects/node-application'
import ProjectBuilder, { ProjectBuilderProps } from 'executors/builder'
import { cmdNmPath } from 'utils/path'

/**
 * node应用构建器实例化参数
 */
export interface NodeApplicationBuilderProps extends ProjectBuilderProps<NodeApplication> {
  /**
   * 是否监视源文件变化（当原数据更改时会触发重新构建）
   */
  watch?: boolean
}

/**
 * node应用构建器
 */
export default class NodeApplicationBuilder extends ProjectBuilder<NodeApplication> {
  private watch: boolean

  private scriptFilePattern: RegExp

  private defineFilePattern: RegExp

  private testFilePattern: RegExp

  constructor(props: NodeApplicationBuilderProps) {
    super(props)
    this.watch = props.watch || false
    this.scriptFilePattern = /\.(js|mjs|ts)$/
    this.defineFilePattern = /\.d\.ts$/
    this.testFilePattern = /\.test\.(js|mjs|ts)$/
  }

  async main() {
    this.downloadModules()
    await del(this.project.distPath)
    await this.compile()
    if (this.watch) {
      const watcher = watch(this.project.withSrcPath('**/*'), () => {
        return this.compile()
      })
      this.on('close', () => watcher.close())
      return new Promise<void>(resolve => {
        watcher.on('close', resolve)
      })
    }
  }

  /**
   * 编译
   */
  private compile() {
    return new Promise<void>((resolve, reject) => {
      const buildOra = ora(`${this.project.name} is building`)
      const taskLine = async () => {
        await this.copyAssets()
        await this.compileLib()
      }
      buildOra.start()
      taskLine().then(() => {
        buildOra.succeed(`${this.project.name} builded successfully!`)
        resolve()
      }).catch(err => {
        buildOra.fail(`${this.project.name} build failed!`)
        console.error(err)
        reject()
      })
    })
  }

  /**
   * 复制其他非脚本文件至dist目录
   */
  private copyAssets() {
    return new Promise<void>((resolve, reject) => {
      src([
        this.project.withSrcPath('**/*'),
        this.project.withSrcPath('**/.*')
      ], {
        cwd: this.project.path
      })
        .pipe(filter(file => !this.scriptFilePattern.test(file.path)))
        .pipe(dest(this.project.distPath))
        .on('error', reject)
        .on('end', resolve)
    })
  }

  /**
   * 将脚本转成node语法至dist目录
   */
  private compileLib() {
    return new Promise<void>((resolve, reject) => {
      if (!this.project.hasBabelRuntimeDependence()) {
        reject('please install @babel/runtime dependence')
      }
      src(this.project.withSrcPath('**/*'), {
        cwd: this.project.path
      })
        .pipe(filter(file => {
          return this.scriptFilePattern.test(file.path)
            && !this.defineFilePattern.test(file.path)
            && !this.testFilePattern.test(file.path)
        }))
        .pipe(
          babel({
            presets: [
              [cmdNmPath('@babel/preset-env'), {
                modules: 'cjs'
              } as BabelPresetEnvOpts] as any,
              cmdNmPath('@babel/preset-typescript'),
            ],
            plugins: [
              this.getModuleAliasBabelPlugin(),
              cmdNmPath('@babel/plugin-transform-runtime'),
              cmdNmPath('@babel/plugin-proposal-class-properties'),
            ].fill(Boolean)
          })
          .on('error', reject)
        )
        .pipe(uglify({ mangle: { toplevel: true }}))
        .pipe(dest(this.project.distPath))
        .on('error', reject)
        .on('end', resolve)
    })
  }
}
