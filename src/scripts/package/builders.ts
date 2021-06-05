import del from 'del'
import { mapValues } from 'lodash'
import gulp from 'gulp'
import gulpFilter from 'gulp-filter'
import gulpBabel from 'gulp-babel'
import gulpTypescript from 'gulp-typescript'
import gulpConcat from 'gulp-concat'
import gulpSourcemaps from 'gulp-sourcemaps'
import gulpUglify from 'gulp-uglify'
import { Options as BabelPresetEnvOpts } from '@babel/preset-env'
import Package from 'projects/package'
import Builder, { BuilderProps } from 'executors/builder'
import { cmdNmPath, relativePath } from 'utils/path'
import { printLoading, printSuccess } from 'utils/print'

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

  /**
   * 源文件目录中的所有路径
   */
  protected srcGlob: string

  /**
   * 源文件目录中的脚本文件名匹配表达式
   */
  protected srcScriptFilePattern: RegExp

  /**
   * 源文件目录中的定义文件名匹配表达式
   */
  protected srcDefineFilePattern: RegExp
  
  /**
   * 源文件目录中的测试文件名匹配表达式
   */
  protected srcTestFilePattern: RegExp

  constructor(props: PackageBuilderProps) {
    super(props)
    this.watch = props.watch || false
    this.srcGlob = this.project.withSrcPath('**/*')
    this.srcScriptFilePattern = /\.(js|mjs|jsx|ts|tsx)$/
    this.srcDefineFilePattern = /\.d\.(ts|tsx)$/
    this.srcTestFilePattern = /\.test\.(js|mjs|jsx|ts|tsx)$/
  }

  async main() {
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
    const config = this.project.config
    printLoading(`${this.project.name} is building`)
    await this.copyFiles({
      outputToWeb: config.buildWeb,
      outputToNode: config.buildNode
    })
    if (config.buildTypes) {
      await this.compileTypes()
    }
    if (config.buildWeb) {
      await this.compileScripts({
        target: 'web',
        useReact: config.useReact,
        useCompress: config.useCompress,
        useMerge: config.useMerge
      })
    }
    if (config.buildNode) {
      await this.compileScripts({
        target: 'node',
        useReact: config.useReact,
        useCompress: config.useCompress,
        useMerge: config.useMerge
      })
    }
    printSuccess(`${this.project.name} builded successfully!`)
  }

  /**
   * 获取环境相关的Babel预设集
   */
  private getBabelEnvPreset(target: 'web' | 'node'): any {
    return [cmdNmPath('@babel/preset-env'), {
      modules: target === 'web' ? false : 'cjs'
    } as BabelPresetEnvOpts]
  }

  /**
   * 获取自定义模块别名的Babel插件
   */
  private getBabelModuleAliasPlugin(): any {
    const aliasMap = mapValues(
      this.project.config.moduleAlias || {},
      value => this.project.withPath(value)
    )
    const aliasKeys = Object.keys(aliasMap)
    if (aliasKeys.length <= 0) {
      return
    }
    const resolvePath = (source: string, current: string) => {
      let matchedKey: string = ''
      for(let i = 0; i < aliasKeys.length; i++) {
        const key = aliasKeys[i]
        if (key[0] === source[0] && source.startsWith(key)) {
          matchedKey = key
          break
        }
      }
      if (!matchedKey) {
        return source
      }
      return relativePath(
        this.project.withPath(source.replace(matchedKey, aliasMap[matchedKey])),
        current
      )
    }
    return [
      cmdNmPath('babel-plugin-module-resolver'),
      { resolvePath }
    ]
  }

  /**
   * 复制文件至dist目录
   * @param outputToWeb 输出到web目录中
   * @param outputToNode 输出到node目录中
   */
  protected copyFiles({
    outputToWeb,
    outputToNode
  }: {
    outputToWeb?: boolean
    outputToNode?: boolean
  } = {}): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let stream = gulp.src(this.srcGlob, {
        cwd: this.project.path
      })
      stream.on('end', resolve)
      stream.on('error', reject)
      stream = stream.pipe(gulpFilter(file => {
        return !this.srcScriptFilePattern.test(file.path)
      }))
      if (outputToWeb) {
        stream = stream.pipe(gulp.dest(this.project.webDistPath))
      }
      if (outputToNode) {
        stream = stream.pipe(gulp.dest(this.project.nodeDistPath))
      }
    })
  }

  /**
   * 生成定义文件至dist目录
   */
  protected async compileTypes(): Promise<void> {
    /**
     * 复制定义文件至types目录
     */
    await new Promise((resolve, reject) => {
      let stream = gulp.src(this.srcGlob, {
        cwd: this.project.path
      })
      stream.on('end', resolve)
      stream.on('error', reject)
      stream = stream.pipe(gulpFilter(file => {
        return this.srcDefineFilePattern.test(file.path)
      }))
      stream = stream.pipe(gulp.dest(this.project.typesDistPath))
    })
    /**
     * 编译脚本文件至dist目录
     */
    await new Promise((resolve, reject) => {
      const project = gulpTypescript.createProject(
        this.project.withPath('tsconfig.json'),
        {
          declaration: true,
          removeComments: false,
        }
      )
      let stream = project.src()
      stream.on('end', resolve)
      stream.on('error', reject)
      let cstream = project()
      cstream.on('error', reject)
      cstream = stream.pipe(cstream)
      cstream.dts.pipe(gulp.dest(this.project.typesDistPath))
    })
  }

  /**
   * 生成脚本文件至dist目录
   * @param target 构建的目标类型
   * @param useReact 是否开启react
   * @param useMerge 是否将多个文件合并于一处
   * @param useCompress 是否压缩
   */
  protected compileScripts({
    target,
    useReact,
    useMerge,
    useCompress
  }: {
    target: 'web' | 'node'
    useReact?: boolean
    useMerge?: boolean
    useCompress?: boolean
  }) {
    return new Promise((resolve, reject) => {
      if (!this.project.hasBabelRuntimeDependence()) {
        reject('please install @babel/runtime dependence')
      }
      let stream = gulp.src(this.srcGlob, {
        cwd: this.project.path
      })
      stream.on('end', resolve)
      stream.on('error', reject)
      stream = stream.pipe(gulpFilter(file => {
        return this.srcScriptFilePattern.test(file.path)
          && !this.srcDefineFilePattern.test(file.path)
          && !this.srcTestFilePattern.test(file.path)
      }))
      stream = stream.pipe(gulpSourcemaps.init())
      const babelLine = gulpBabel({
        presets: [
          this.getBabelEnvPreset(target),
          useReact && cmdNmPath('@babel/preset-react'),
          cmdNmPath('@babel/preset-typescript'),
        ].filter(Boolean),
        plugins: [
          this.getBabelModuleAliasPlugin(),
          cmdNmPath('@babel/plugin-transform-runtime'),
          cmdNmPath('@babel/plugin-proposal-class-properties'),
        ].filter(Boolean)
      })
      babelLine.on('error', reject)
      stream = stream.pipe(babelLine)
      if (useMerge) {
        stream = stream.pipe(gulpConcat('index.js'))
      }
      if (useCompress) {
        stream = stream.pipe(gulpUglify({
          mangle: {
            toplevel: true
          }
        }))
      }
      stream = stream.pipe(gulpSourcemaps.write())
      stream = stream.pipe(gulp.dest(
        target === 'web'
          ? this.project.webDistPath
          : this.project.nodeDistPath
      ))
    })
  }
}
