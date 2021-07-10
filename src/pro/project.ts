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
   * 项目名称（中文、英文都可以）
   * 不写，则使用package.json中的name字段代替
   */
  name: string

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
   * 项目目录路径
   */
  root: string

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
   * 项目目录路径
   */
  root: string

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
    root: projectPath,
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
   * 项目ID（依据项目信息自动生成）
   * 规则：${project.type}_${package.json/name}_${project.version}
   */
  readonly id: string

  /**
   * 项目类型
   */
  readonly type: TType

  /**
   * 项目目录路径
   */
  readonly root: string

  /**
   * 项目配置信息
   */
  readonly config: TConfig

  /**
   * 页面配置信息（未合并过默认配置的）
   */
  protected __config__: Partial<TConfig>

  /**
   * 项目包信息
   */
  readonly package: PackageInfo

  /**
   * 项目名称（中文、英文都可以）
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
  readonly buf: string

  /**
   * 项目源文件目录
   */
  readonly src: string

  /**
   * 项目生成资源文件目录
   */
  readonly pub: string

  /**
   * 项目文档目录
   */
  readonly doc: string

  /**
   * 项目模块文件目录
   */
  readonly mdl: string

  /**
   * typescript配置文件路径
   */
  readonly tsc: string

  /**
   * 项目生成的资源文件目录
   */
  readonly dist: string

  /**
   * 项目生成的公共资源文件目录
   */
  readonly astDist: string

  /**
   * 项目生成的定义文件目录
   */
  readonly defDist: string

  /**
   * 项目生成的web端资源文件目录
   */
  readonly webDist: string

  /**
   * 项目生成的node端资源文件目录
   */
  readonly nodeDist: string

  /**
   * ts配置的缓存
   */
  private tsconfig: any

  constructor(props: ProjectProps<TType, TConfig>, defaultConfig: TConfig) {
    /**
     * 建立项目相关路径
     */
    this.root = props.root
    this.buf = this.withRoot('buf')
    this.src = this.withRoot('src')
    this.pub = this.withRoot('pub')
    this.doc = this.withRoot('doc')
    this.mdl = this.withRoot('node_modules')
    this.tsc = this.withRoot('tsconfig.json')
    this.dist = this.withRoot('dist')
    this.astDist = this.withDist('ast')
    this.defDist = this.withDist('def')
    this.webDist = this.withDist('web')
    this.nodeDist = this.withDist('node')
    /**
     * 获取包信息
     */
    this.package = props.package || readPackageInfoSync(this.root)
    /**
     * 获取配置信息
     */
    let __config__: any = undefined
    if (isPlainObject(props.config)) {
      __config__ = props.config
    } else if (isString(props.config)) {
      __config__ = readJsonSync(props.config, this.root)
    } else {
      __config__ = getProjectConfigSync(this.root)
    }
    this.__config__ = __config__
    const config = defaultsDeep({}, __config__, defaultConfig)
    /**
     * 初始化其他数据
     */
    this.config = config
    this.type = config.type
    this.author = this.package.author
    this.version = this.package.version
    this.name = config.name = __config__.name || this.package.name
    this.id = [this.type, this.package.name, this.version].join('_')
  }

  /**
   * 拼接项目根路径
   */
  withRoot(...pathList: string[]) {
    return withPath(this.root, ...pathList)
  }

  /**
   * 拼接buf路径
   */
  withBuf(...pathList: string[]) {
    return withPath(this.buf, ...pathList)
  }

  /**
   * 拼接src路径
   */
  withSrc(...pathList: string[]) {
    return withPath(this.src, ...pathList)
  }

  /**
   * 拼接pub路径
   */
  withPub(...pathList: string[]) {
    return withPath(this.pub, ...pathList)
  }

  /**
   * 拼接doc路径
   */
  withDoc(...pathList: string[]) {
    return withPath(this.doc, ...pathList)
  }

  /**
   * 拼接dist路径
   */
  withDist(...pathList: string[]) {
    return withPath(this.dist, ...pathList)
  }

  /**
   * 拼接module路径
   */
  withMdl(...pathList: string[]) {
    return withPath(this.mdl, ...pathList)
  }

  /**
   * 获取项目依赖包的版本
   * 获取不到，则返回空字符串
   */
  getDepVersion(dep: string): string {
    const deps = this.package.dependencies
    return deps && deps[dep] || ''
  }

  /**
   * 获取项目的ts配置
   */
  getTsconfig() {
    if (!this.tsconfig) {
      if (fse.existsSync(this.tsc)) {
        this.tsconfig = fse.readJSONSync(this.tsc)
      } else {
        this.tsconfig = {}
      }
    }
    return this.tsconfig
  }
}
