import { mapValues } from 'lodash'
import gulp from 'gulp'
import gulpFilter, { FileFunction as GulpFilter, Options as GulpFilterOptions } from 'gulp-filter'
import gulpBabel from 'gulp-babel'
import gulpTypescript from 'gulp-typescript'
import gulpUglify from 'gulp-uglify'
import { Options as BabelPresetEnvOpts } from '@babel/preset-env'
import Project, { ProjectConfig } from 'projects/project'
import { cmdNmPath, relativePath } from 'utils/path'
import Executor, { ExecutorProps } from './executor'

/**
 * 项目构建器实例化参数
 */
export interface BuilderProps<
  TProject extends Project<string, ProjectConfig<string>>
> extends ExecutorProps<TProject> {}

/**
 * 项目构建器
 */
export default abstract class Builder<
  TProject extends Project<string, ProjectConfig<string>>
> extends Executor<TProject> {
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

  constructor(props: BuilderProps<TProject>) {
    super(props)
    this.srcGlob = this.project.withSrcPath('**/*')
    this.srcScriptFilePattern = /\.(js|mjs|jsx|ts|tsx)$/
    this.srcDefineFilePattern = /\.d\.(ts|tsx)$/
    this.srcTestFilePattern = /\.test\.(js|mjs|jsx|ts|tsx)$/
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
    const aliasMap = mapValues(this.project.config.moduleAlias || {}, value => {
      return this.project.withPath(value)
    })
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
   * @param filter 指定复制哪些文件至dist目录
   * @param filterOptions 过滤文件的选项
   * @param outputToWeb 输出到web目录中
   * @param outputToNode 输出到node目录中
   * @param outputToTypes 输出到types目录中
   */
  protected copyFiles({
    filter,
    filterOptions,
    outputToWeb,
    outputToNode,
    outputToTypes
  }: {
    filter?: string | string[] | GulpFilter
    filterOptions?: GulpFilterOptions
    outputToWeb?: boolean
    outputToNode?: boolean
    outputToTypes?: boolean
  } = {}): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let stream = gulp.src(this.srcGlob, {
        cwd: this.project.path
      })
      stream.on('end', resolve)
      stream.on('error', reject)
      stream = stream.pipe(gulpFilter(
        filter === undefined
          ? file => !this.srcScriptFilePattern.test(file.path)
          : filter,
        filterOptions
      ))
      if (outputToWeb) {
        stream = stream.pipe(gulp.dest(this.project.webDistPath))
      }
      if (outputToNode) {
        stream = stream.pipe(gulp.dest(this.project.nodeDistPath))
      }
      if (outputToTypes) {
        stream = stream.pipe(gulp.dest(this.project.typesDistPath))
      }
    })
  }

  /**
   * 生成定义文件至dist目录
   * @param filter 指定生成哪些定义文件至dist目录
   * @param filterOptions 过滤文件的选项
   */
  protected async compileTypes({
    filter,
    filterOptions,
  }: {
    filter?: string | string[] | GulpFilter
    filterOptions?: GulpFilterOptions
  } = {}): Promise<void> {
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
      if (filter) {
        stream = stream.pipe(gulpFilter(filter, filterOptions))
      }
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
      if (filter) {
        stream = stream.pipe(gulpFilter(filter, filterOptions))
      }
      let cstream = project()
      cstream.on('error', reject)
      cstream = stream.pipe(cstream)
      cstream.dts.pipe(gulp.dest(this.project.typesDistPath))
    })
  }

  /**
   * 生成脚本文件至dist目录
   * @param filter 指定编译哪些脚本文件至dist目录
   * @param filterOptions 过滤文件的选项
   * @param target 构建的目标类型
   * @param useReact 是否开启react
   * @param useCompress 是否开启压缩
   */
  protected compileScripts({
    filter,
    filterOptions,
    target,
    useReact,
    useCompress
  }: {
    filter?: string | string[] | GulpFilter
    filterOptions?: GulpFilterOptions
    target: 'web' | 'node'
    useReact?: boolean
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
      if (filter) {
        stream = stream.pipe(gulpFilter(filter, filterOptions))
      }
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
      if (useCompress) {
        stream = stream.pipe(gulpUglify({
          mangle: {
            toplevel: true
          }
        }))
      }
      stream = stream.pipe(gulp.dest(
        target === 'web'
          ? this.project.webDistPath
          : this.project.nodeDistPath
      ))
    })
  }
}
