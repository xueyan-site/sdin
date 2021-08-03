/**
 * refers to any object
 */
export interface AnyObject {
  [prop: string]: any
}

/**
 * npm package information
 */
export interface PackageInfo {
  [prop: string]: any
  name: string // package name
  version: string // package version
  author: string // package author
}
