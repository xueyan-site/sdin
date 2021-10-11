interface AnyObject<TValue = any> {
  [prop: string]: TValue
}

interface PackageInfo {
  [prop: string]: any
  name: string
  version: string
  author: string
}
