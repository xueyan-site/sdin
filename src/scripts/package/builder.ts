import del from 'del'
import gulp from 'gulp'
import { Stats } from 'fs-extra'
import { mapValues } from 'lodash'
import gulpBabel from 'gulp-babel'
import gulpTs from 'gulp-typescript'
import gulpUglify from 'gulp-uglify'
import gulpFilter, { FileFunction as FilterFunc } from 'gulp-filter'
import { SrcOptions as VinylSrcOptions } from 'vinyl-fs'
import { cmdNmPath, relativePath } from 'utils/path'
import { pipeline } from 'utils/exec'
import { printError, printLoading, printSuccess } from 'utils/print'
import Package from 'projects/package'
import Builder, { BuilderProps } from 'executors/builder'
import { AnyObject } from 'types'

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
   * 源目录Vinyl配置选项
   */
  readonly srcOpts: VinylSrcOptions

  /**
   * 脚本文件名匹配表达式
   */
  protected scriptExp: RegExp

  /**
   * 定义文件名匹配表达式
   */
  protected typescriptExp: RegExp

  /**
   * 定义文件名匹配表达式
   */
  protected defineExp: RegExp
  
  /**
   * 测试文件名匹配表达式
   */
  protected testExp: RegExp

  constructor(props: PackageBuilderProps) {
    super(props)
    this.watch = props.watch || false
    this.srcOpts = { cwd: this.project.srcPath }
    this.scriptExp = /\.(t|j)sx?$/
    this.typescriptExp = /\.tsx?$/
    this.defineExp = /\.d\.tsx?$/
    this.testExp = /\.test\./
  }

  async main() {
    await del(this.project.distPath)
    printLoading(`project ${this.project.name} is building`)
    if (!this.watch) {
      await this.compile()
      return printSuccess(`project ${this.project.name} was built successfully`)
    }
    this.compile().then(() => {
      printSuccess(`project ${this.project.name} was built successfully, please develop continue`)
    }).catch(err => {
      printError(`project ${this.project.name} was rebuilt failed`)
      console.error(err)
    })
    const watcher = gulp.watch('**/*', this.srcOpts)
    const watchHandler = (path: string, stats: Stats) => {
      const pathType = stats.isDirectory() ? 'folder' : stats.isFile() ? 'file' : ''
      if (pathType) {
        printLoading(`${pathType} ${path} is rebuilding`)
        this.compile(file => file.path.includes(path)).then(() => {
          printSuccess(`${pathType} ${path} was rebuilt successfully`)
        }).catch(err => {
          printError(`${pathType} ${path} was rebuilt failed`)
          console.error(err)
        })
      }
    }
    watcher.on('addDir', watchHandler)
    watcher.on('change', watchHandler)
    this.on('close', () => watcher.close())
    return new Promise<void>((resolve, reject) => {
      watcher.on('close', resolve)
      watcher.on('error', reject)
    })
  }

  /**
   * 编译
   */
  private async compile(filter?: FilterFunc) {
    this.precheck()
    await this.defineTask(filter)
    await Promise.all<void>([
      this.assetTask(filter),
      this.typesTask()
    ])
    await Promise.all<void>([
      this.scriptTask('web', filter),
      this.scriptTask('node', filter)
    ])
  }

  /**
   * 预校验
   */
  precheck() {
    if (!this.project.getDependenceVersion('@babel/runtime')) {
      throw new Error('please install @babel/runtime dependence')
    }
  }

  /**
   * 处理素材文件
   * @param toWeb 输出到web目录中
   * @param toNode 输出到node目录中
   */
  protected assetTask(filter?: FilterFunc) {
    const { buildWeb, buildNode } = this.project.config
    if (!buildWeb && !buildNode) {
      return
    }
    return pipeline(
      gulp.src('**/*', this.srcOpts),
      gulpFilter(file => {
        return !this.scriptExp.test(file.path) 
          && (filter ? filter(file) : true)
      }),
      buildWeb && gulp.dest(this.project.webDistPath),
      buildNode && gulp.dest(this.project.nodeDistPath)
    )
  }

  /**
   * 处理定义文件
   */
  protected defineTask(filter?: FilterFunc) {
    const { buildTypes } = this.project.config
    if (!buildTypes) {
      return
    }
    return pipeline(
      gulp.src('**/*', this.srcOpts),
      gulpFilter(file => {
        return this.defineExp.test(file.path) 
          && (filter ? filter(file) : true)
      }),
      gulp.dest(this.project.typesDistPath)
    )
  }

  /**
   * 构建类型文件
   */
  protected typesTask() {
    const { buildTypes } = this.project.config
    if (!buildTypes) {
      return
    }
    const tsProject = gulpTs.createProject(
      this.project.tsconfigPath,
      {
        declaration: true,
        removeComments: false,
      }
    )
    return pipeline(
      tsProject.src(),
      tsProject(),
      (ts) => ts.dts,
      gulp.dest(this.project.typesDistPath)
    )
  }

  /**
   * 处理脚本文件
   * @param target 构建的目标类型
   */
  protected scriptTask(
    target: 'web' | 'node',
    filter?: FilterFunc
  ) {
    const { buildWeb, buildNode, useUglify } = this.project.config
    if ((!buildWeb && target === 'web') || (!buildNode && target === 'node')) {
      return
    }
    return pipeline(
      gulp.src('**/*', this.srcOpts),
      gulpFilter(file => {
        return this.scriptExp.test(file.path)
          && !this.defineExp.test(file.path)
          && !this.testExp.test(file.path)
          && (filter ? filter(file) : true)
      }),
      gulpBabel(this.getBabelOptions(target)),
      useUglify && gulpUglify({
        mangle: {
          toplevel: true
        }
      }),
      gulp.dest(
        target === 'web'
          ? this.project.webDistPath
          : this.project.nodeDistPath
      )
    )
  }

  /**
   * 缓存Babel配置
   */
  private babelOptionsMap: AnyObject = {}

  /**
   * 获取Babel配置
   */
  protected getBabelOptions(target: 'web' | 'node'): any {
    let opts = this.babelOptionsMap[target]
    if (!opts) {
      const { useReact } = this.project.config
      opts = {
        presets: [
          [cmdNmPath('@babel/preset-env'), {
            modules: target === 'web' ? false : 'cjs'
          }],
          useReact && cmdNmPath('@babel/preset-react'),
          cmdNmPath('@babel/preset-typescript')
        ].filter(Boolean),
        plugins: [
          this.getModuleAliasBabelPlugin(),
          cmdNmPath('@babel/plugin-transform-runtime'),
          cmdNmPath('@babel/plugin-proposal-class-properties')
        ].filter(Boolean)
      }
      this.babelOptionsMap[target] = opts
    }
    return opts
  }

  /**
   * 缓存自定义模块别名Babel插件
   */
  private moduleAliasBabelPlugin: any

  /**
   * 获取自定义模块别名Babel插件
   */
  protected getModuleAliasBabelPlugin(): any {
    if (this.moduleAliasBabelPlugin === undefined) {
      const aliasMap = mapValues(
        this.project.config.moduleAlias || {},
        value => this.project.withPath(value)
      )
      const aliasKeys = Object.keys(aliasMap)
      if (aliasKeys.length <= 0) {
        this.moduleAliasBabelPlugin = false
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
          this.project.withPath(
            source.replace(matchedKey, aliasMap[matchedKey])
          ),
          current
        )
      }
      this.moduleAliasBabelPlugin = [
        cmdNmPath('babel-plugin-module-resolver'),
        { resolvePath }
      ]
    }
    return this.moduleAliasBabelPlugin
  }
}
