/**
 * 用以指代任一对象
 */
export interface AnyObject {
  [prop: string]: any
}

/**
 * Git信息格式
 */
export interface GitInfo {
  user: {
    name: string // 用户名称
    email: string // 用户邮箱
  }
  [prop: string]: any
}

/**
 * 包信息格式
 */
export interface PackageInfo {
  name: string // 包的名称
  version: string // 包的版本
  author: string // 包的作者
  [prop: string]: any
}