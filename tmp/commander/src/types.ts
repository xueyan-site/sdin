interface AnyObject<TValue = any> {
  [prop: string]: TValue
}

interface PackageInfo {
  [prop: string]: any
  name: string // 包的名称
  version: string // 包的版本
  author: string // 包的作者
}
