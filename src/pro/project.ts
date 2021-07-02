import fse from 'fs-extra'
import { defaultsDeep, isPlainObject, isString } from 'lodash'
import { withPath } from 'utl/path'
import { readJsonSync, readPackageInfoSync } from 'utl/read'
import { AnyObject, PackageInfo, ModuleAlias } from 'types'

/**
 * 项目配置信息
 */
export interface ProjectConfig<TType extends string> {
  /**
   * 项目类型
   */
  type: TType

  /**
   * 模块的alias
   * webpack.resolve.alias | babel-plugin-module-resolver.alias
   * <https://webpack.docschina.org/configuration/resolve/#resolvealias>
   * <https://github.com/tleunen/babel-plugin-module-resolver/blob/master/DOCS.md>
   */
  alias?: ModuleAlias
}

/**
 * 项目实例化参数
 */
export interface ProjectProps<
  TType extends string, 
  TConfig extends ProjectConfig<TType>
> {
  /**
   * 项目路径
   */
  path: string

  /**
   * 项目配置信息
   */
  config?: Partial<TConfig> | string

  /**
   * 项目包信息
   */
  package?: PackageInfo
}

/**
 * 项目元信息（即项目的主要信息）
 */
interface ProjectMeta {
  /**
   * 项目类型
   */
  type: string

  /**
   * 项目路径
   */
  path: string

  /**
   * 项目配置信息
   */
  config: AnyObject

  /**
   * 项目包名
   */
  package: PackageInfo
}

/**
 * 按照项目的约定规则去读取配置信息
 */
function getProjectConfigSync(projectPath: string): AnyObject {
  if (fse.existsSync(withPath(projectPath, 'project.js'))) {
    return readJsonSync('project.js', projectPath)
  } else {
    return {}
  }
}

/**
 * 读取项目元信息
 */
export function readProjectMeta(projectPath: string): ProjectMeta {
  const packageInfo = readPackageInfoSync(projectPath)
  const config = getProjectConfigSync(projectPath)
  return {
    type: config.type || '',
    path: projectPath,
    config,
    package: packageInfo,
  }
}

/**
 * 项目
 */
export default abstract class Project<
  TType extends string,
  TConfig extends ProjectConfig<TType>
> {
  /**
   * 项目ID（同一项目，每次一样）
   */
  readonly id: string

  /**
   * 项目类型
   */
  readonly type: TType

  /**
   * 项目路径
   */
  readonly path: string

  /**
   * 项目配置信息
   */
  readonly config: TConfig

  /**
   * 项目包信息
   */
  readonly package: PackageInfo

  /**
   * 项目名称
   */
  readonly name: string

  /**
   * 项目版本
   */
  readonly version: string

  /**
   * 项目作者
   */
  readonly author: string

  /**
   * 项目构建时的临时缓存文件目录
   */
  readonly bufPath: string

  /**
   * 项目源文件目录
   */
  readonly srcPath: string

  /**
   * 项目生成资源文件目录
   */
  readonly pubPath: string

  /**
   * 项目文档目录
   */
  readonly docPath: string

  /**
   * 项目生成的资源文件目录
   */
  readonly distPath: string

  /**
   * 项目生成的公共资源文件目录
   */
  readonly astDistPath: string

  /**
   * 项目生成的定义文件目录
   */
  readonly defDistPath: string

  /**
   * 项目生成的web端资源文件目录
   */
  readonly webDistPath: string

  /**
   * 项目生成的node端资源文件目录
   */
  readonly nodeDistPath: string

  /**
   * 项目模块文件目录
   */
  readonly mdlPath: string

  /**
   * typescript配置文件路径
   */
  readonly tscPath: string

  /**
   * ts配置的缓存
   */
  private tsconfig: any
  
  /**
   * 项目依赖映射表
   */
  protected dependenceMap: AnyObject<string>

  constructor(props: ProjectProps<TType, TConfig>, defaultConfig: TConfig) {
    /**
     * 建立项目相关路径
     */
    this.path = props.path
    this.bufPath = this.withPath('buf')
    this.srcPath = this.withPath('src')
    this.pubPath = this.withPath('pub')
    this.docPath = this.withPath('doc')
    this.distPath = this.withPath('dist')
    this.astDistPath = this.withDistPath('ast')
    this.defDistPath = this.withDistPath('def')
    this.webDistPath = this.withDistPath('web')
    this.nodeDistPath = this.withDistPath('node')
    this.mdlPath = this.withPath('node_modules')
    this.tscPath = this.withPath('tsconfig.json')
    /**
     * 获取包信息
     */
    this.package = props.package || readPackageInfoSync(this.path)
    this.name = this.package.name
    this.version = this.package.version
    this.author = this.package.author
    this.dependenceMap = this.package.dependencies || {}
    /**
     * 获取配置信息
     */
    let __config__: any = undefined
    if (isPlainObject(props.config)) {
      __config__ = props.config
    } else if (isString(props.config)) {
      __config__ = readJsonSync(props.config, this.path)
    } else {
      __config__ = getProjectConfigSync(this.path)
    }
    this.config = defaultsDeep(__config__, defaultConfig)
    this.type = this.config.type
    this.id = [this.type, this.name, this.version].join('_')
  }

  /**
   * 拼接项目根路径
   */
  withPath(...pathList: string[]) {
    return withPath(this.path, ...pathList)
  }

  /**
   * 拼接buf路径
   */
  withBufPath(...pathList: string[]) {
    return withPath(this.bufPath, ...pathList)
  }

  /**
   * 拼接src路径
   */
  withSrcPath(...pathList: string[]) {
    return withPath(this.srcPath, ...pathList)
  }

  /**
   * 拼接pub路径
   */
  withPubPath(...pathList: string[]) {
    return withPath(this.pubPath, ...pathList)
  }

  /**
   * 拼接doc路径
   */
  withDocPath(...pathList: string[]) {
    return withPath(this.docPath, ...pathList)
  }

  /**
   * 拼接dist路径
   */
  withDistPath(...pathList: string[]) {
    return withPath(this.distPath, ...pathList)
  }

  /**
   * 拼接module路径
   */
  withMdlPath(...pathList: string[]) {
    return withPath(this.mdlPath, ...pathList)
  }

  /**
   * 获取项目依赖包的版本
   * 获取不到，则返回空字符串
   */
  getDependenceVersion(dep: string): string {
    return this.dependenceMap[dep] || ''
  }

  /**
   * 获取项目的ts配置
   */
  getTsconfig() {
    if (!this.tsconfig) {
      if (fse.existsSync(this.tscPath)) {
        this.tsconfig = fse.readJSONSync(this.tscPath)
      } else {
        this.tsconfig = {}
      }
    }
    return this.tsconfig
  }
}
