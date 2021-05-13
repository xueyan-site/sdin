import ora from 'ora'
import del from 'del'
import { src, dest, watch } from 'gulp'
import ts from 'gulp-typescript'
import filter from 'gulp-filter'
import babel from 'gulp-babel'
import { Options as BabelPresetEnvOpts } from '@babel/preset-env'
import ReactPackage from 'projects/react-package'
import ProjectBuilder, { ProjectBuilderProps } from 'base/project-builder'
import { cmdNmPath } from 'utils/path'

/**
 * react包构建器实例化参数
 */
export interface ReactPackageBuilderProps extends ProjectBuilderProps<ReactPackage> {
  /**
   * 是否监视源文件变化（当原数据更改时会触发重新构建）
   */
  watch?: boolean
}

/**
 * react包构建器
 */
export default class ReactPackageBuilder extends ProjectBuilder<ReactPackage> {
  private watch: boolean

  private esmDistPath: string

  private libDistPath: string

  private typeDistPath: string

  private scriptFilePattern: RegExp

  private defineFilePattern: RegExp

  private testFilePattern: RegExp

  constructor(props: ReactPackageBuilderProps) {
    super(props)
    this.watch = props.watch || false
    this.esmDistPath = this.project.withDistPath('esm')
    this.libDistPath = this.project.withDistPath('lib')
    this.typeDistPath = this.project.withDistPath('types')
    this.scriptFilePattern = /\.(js|mjs|jsx|ts|tsx)$/
    this.defineFilePattern = /\.d\.(ts|tsx)$/
    this.testFilePattern = /\.test\.(js|mjs|jsx|ts|tsx)$/
  }

  async main() {
    this.downloadModules()
    await del(this.project.distPath)
    await this.compile()
    if (this.watch) {
      const watcher = watch(this.project.withSrcPath('**/*'), { 
        cwd: this.project.path 
      }, () => {
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
        await this.compileTypes()
        await this.compileEsm()
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
   * @param done 
   */
  private copyAssets(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      src([
        this.project.withSrcPath('**/*'),
        this.project.withSrcPath('**/.*')
      ], {
        cwd: this.project.path
      })
        .pipe(filter(file => !this.scriptFilePattern.test(file.path)))
        .pipe(dest(this.esmDistPath))
        .pipe(dest(this.libDistPath))
        .on('error', reject)
        .on('end', resolve)
    })
  }

  /**
   * 生成脚本的类型定义至dist目录
   * @param done 
   */
  private async compileTypes(): Promise<void> {
    await new Promise((resolve, reject) => {
      src(this.project.withSrcPath('**/*'), {
        cwd: this.project.path
      })
        .pipe(filter(file => this.defineFilePattern.test(file.path)))
        .pipe(dest(this.typeDistPath))
        .on('error', reject)
        .on('end', resolve)
    })
    await new Promise((resolve, reject) => {
      const tsProject = ts.createProject(
        this.project.withPath('tsconfig.json'),
        {
          declaration: true,
          removeComments: false,
        }
      )
      tsProject.src()
        .pipe(tsProject().on('error', reject))
        .dts.pipe(dest(this.typeDistPath))
        .on('error', reject)
        .on('end', resolve)
    })
  }

  /**
   * 将脚本的转成es语法至dist目录
   * @param done 
   */
  private compileEsm() {
    return new Promise((resolve, reject) => {
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
                modules: false
              } as BabelPresetEnvOpts] as any,
              cmdNmPath('@babel/preset-react'),
              cmdNmPath('@babel/preset-typescript'),
            ],
            plugins: [
              this.getModuleAliasBabelPlugin(),
              cmdNmPath('@babel/plugin-transform-runtime'),
              cmdNmPath('@babel/plugin-proposal-class-properties'),
            ].filter(Boolean)
          })
          .on('error', reject)
        )
        .pipe(dest(this.esmDistPath))
        .on('error', reject)
        .on('end', resolve)
    })
  }

  /**
   * 将脚本的转成node语法至dist目录
   * @param done 
   */
  private compileLib() {
    return new Promise((resolve, reject) => {
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
              cmdNmPath('@babel/preset-react'),
              cmdNmPath('@babel/preset-typescript'),
            ],
            plugins: [
              this.getModuleAliasBabelPlugin(),
              cmdNmPath('@babel/plugin-transform-runtime'),
              cmdNmPath('@babel/plugin-proposal-class-properties'),
            ].filter(Boolean)
          })
          .on('error', reject)
        )
        .pipe(dest(this.libDistPath))
        .on('error', reject)
        .on('end', resolve)
    })
  }
}
