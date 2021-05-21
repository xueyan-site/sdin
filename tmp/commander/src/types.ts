/**
 * 代指一切对象
 */
export interface AnyObject {
  [prop: string]: any
}

/**
 * git全局配置信息
 */
export interface GitInfo {
  [prop: string]: any
  user: {
    name: string // 用户名称
    email: string // 用户邮箱
  }
}

/**
 * npm包信息
 */
export interface PackageInfo {
  [prop: string]: any
  name: string // 包的名称
  version: string // 包的版本
  author: string // 包的作者
}
