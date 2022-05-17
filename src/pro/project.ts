import validator from 'validator'
import { joinPath, withPath } from 'utl/path'
import { deepRead, readJsonSync, readPackageInfoSync } from 'utl/read'

/**
 * 项目配置信息
 */
export interface ProjectConfig<TType extends string> {
  /**
   * 项目类型
   */
  type?: TType

  /**
   * 项目名称（中文、英文都可以）
   * 不写，则使用package.json中的name字段代替
   */
  name?: string

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
  config?: TConfig | string

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
  config: Record<string, any>

  /**
   * 项目包名
   */
  package: PackageInfo
}

/**
 * 读取项目元信息
 */
export function readProjectMeta(projectPath: string): ProjectMeta {
  const packageInfo = readPackageInfoSync(projectPath)
  const config = readJsonSync('project.js', projectPath)
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
export abstract class Project<
  TType extends string,
  TConfig extends ProjectConfig<TType>
> {
  /**
   * 项目ID（即package.json/name）
   */
  readonly id: string

  /**
   * 项目名称（中文、英文都可以，默认使用ID）
   */
  readonly name: string

  /**
   * 项目版本
   */
  readonly version: string

  /**
   * 项目作者（包括邮箱）
   */
  readonly author: string

  /**
   * 项目作者姓名
   */
  readonly authorName: string

  /**
   * 项目作者邮箱
   */
  readonly authorEmail: string

  /**
   * 项目类型
   */
  readonly type: TType

  /**
   * 项目目录路径
   */
  readonly root: string

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
   * 项目配置信息
   */
  protected config: TConfig

  /**
   * 项目包信息
   */
  readonly package: PackageInfo

  /**
   * 模块的alias
   * webpack.resolve.alias | babel-plugin-module-resolver.alias
   * <https://webpack.docschina.org/configuration/resolve/#resolvealias>
   * <https://github.com/tleunen/babel-plugin-module-resolver/blob/master/DOCS.md>
   */
  readonly alias?: ModuleAlias

  /**
   * ts配置的缓存
   */
  private __tsConfig__?: Record<string, any>

  constructor(type: TType, props: ProjectProps<TType, TConfig>) {
    // 确定项目的类型
    this.type = type
    // 建立项目相关路径
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
    // 设置项目的包信息、配置信息
    const packageInfo = this.package = props.package || readPackageInfoSync(this.root)
    const config = this.config = readJsonSync(props.config || 'project.js', this.root) as any
    // 设置项目的名称、作者、版本、id
    if (/^[a-z][a-z0-9\-]+$/.test(packageInfo.name)) {
      this.id = packageInfo.name.replace(/[@ \/\.]/g, '_')
    } else {
      throw new Error('please change package.json/name to kebab-case')
    }
    this.name = config.name || packageInfo.name
    this.version = packageInfo.version
    this.alias = config.alias
    const authorMatched = /^(.+) <(.+)>$/.exec(packageInfo.author)
    if (authorMatched && authorMatched.length >= 3) {
      this.author = packageInfo.author
      this.authorName = authorMatched[1]
      this.authorEmail = authorMatched[2]
      if (!validator.isEmail(this.authorEmail)) {
        throw new Error('package.json/author email format error')
      }
    } else {
      throw new Error('please change package.json/author to "author <xxx@xxx.xxx>"')
    }
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
    if (!this.__tsConfig__) {
      this.__tsConfig__ = readJsonSync(this.tsc)
    }
    return this.__tsConfig__
  }

  /**
   * 获取项目中的不规范文件名
   * root 需要扫描的文件夹
   * prefix 最后返回的文件路径中，前面补上的公共路径
   */
  async getIrregularFileList(root: string, prefix?: string): Promise<string[]> {
    const ALLOW_EXP = /^[a-z0-9][a-z0-9\-\.]+$/
    const fileList: string[] = []
    await deepRead(root, node => {
      if (!ALLOW_EXP.test(node.name)) {
        fileList.push(
          prefix 
            ? joinPath(prefix, node.offset)
            : node.offset
        )
      }
    })
    return fileList
  }
}
