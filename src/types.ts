/**
 * 指代任一对象
 */
interface AnyObject<TValue = any> {
  [prop: string]: TValue
}

/**
 * promise或者原样
 */
type PromiseOrNot<T> = T | Promise<T>

/**
 * git全局配置信息
 */
interface GitInfo {
  [prop: string]: any
  user: {
    name: string // 用户名称
    email: string // 用户邮箱
  }
}

/**
 * npm包信息
 */
interface PackageInfo {
  [prop: string]: any
  name: string // 包的名称
  version: string // 包的版本
  author: string // 包的作者
}

/**
 * 模块别名
 */
interface ModuleAlias {
  [index: string]: string
}
