import fse from 'fs-extra'
import { defaultsDeep, isPlainObject, isString } from 'lodash'
import { withPath } from 'utils/path'
import { readJsonSync, readPackageInfoSync } from 'utils/read'
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
  moduleAlias?: ModuleAlias
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
  if (fse.existsSync(withPath(projectPath, 'xueyan.js'))) {
    return readJsonSync('xueyan.js', projectPath)
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
   * 项目源文件目录
   */
  readonly srcPath: string

  /**
   * 项目文档目录
   */
  readonly docPath: string

  /**
   * 项目生成的资源文件目录
   */
  readonly distPath: string

  /**
   * 项目生成的web端资源文件目录
   */
  readonly webDistPath: string

  /**
   * 项目生成的node端资源文件目录
   */
  readonly nodeDistPath: string

  /**
   * 项目生成的定义文件目录
   */
  readonly typesDistPath: string

  /**
   * 项目缓存文件目录
   */
  readonly cachePath: string

  /**
   * 项目缓存文件目录
   */
  readonly modulePath: string

  /**
   * typescript配置文件路径
   */
  readonly tsconfigPath: string

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
    this.srcPath = this.withPath('src')
    this.docPath = this.withPath('doc')
    this.distPath = this.withPath('dist')
    this.webDistPath = this.withDistPath('web')
    this.nodeDistPath = this.withDistPath('node')
    this.typesDistPath = this.withDistPath('types')
    this.cachePath = this.withPath('cache')
    this.modulePath = this.withPath('node_modules')
    this.tsconfigPath = this.withPath('tsconfig.json')
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
  }

  /**
   * 拼接路径
   */
  withPath(...pathList: string[]) {
    return withPath(this.path, ...pathList)
  }

  /**
   * 拼接路径
   */
  withSrcPath(...pathList: string[]) {
    return withPath(this.srcPath, ...pathList)
  }

  /**
   * 拼接路径
   */
  withDocPath(...pathList: string[]) {
    return withPath(this.docPath, ...pathList)
  }

  /**
   * 拼接路径
   */
  withDistPath(...pathList: string[]) {
    return withPath(this.distPath, ...pathList)
  }

  /**
   * 拼接路径
   */
  withCachePath(...pathList: string[]) {
    return withPath(this.cachePath, ...pathList)
  }

  /**
   * 拼接路径
   */
  withModulePath(...pathList: string[]) {
    return withPath(this.modulePath, ...pathList)
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
      if (fse.existsSync(this.tsconfigPath)) {
        this.tsconfig = fse.readJSONSync(this.tsconfigPath)
      } else {
        this.tsconfig = {}
      }
    }
    return this.tsconfig
  }
}
