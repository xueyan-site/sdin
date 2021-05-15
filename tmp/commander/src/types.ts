/**
 * 代指一切对象  
 * means any object  
 */
export interface AnyObject {
  [prop: string]: any
}

/**
 * 包信息  
 * package information  
 */
export interface PackageInfo {
  name: string // 包的名称 package name  
  version: string // 包的版本 package version  
  author: string // 包的作者 package author  
  [prop: string]: any // 其他字段 other fields  
}
