import validator from 'validator'
import { resolve } from 'path'
import { getJsonSync } from './read'
import { printExit } from './console'

export interface PackageInfo extends Record<string, any> {
  name: string
  version: string
  author: string
  authorName: string
  authorEmail: string
}

export function getPackageInfoSync(root: string): PackageInfo {
  const pkg = getJsonSync(resolve(root, 'package.json'), true)
  if (!pkg.name || !pkg.version || !pkg.author) {
    printExit('package.json must contain "name", "version", "author" fields')
  }
  if (!/^[a-z@][a-z0-9\.\/\_\-]+$/.test(pkg.name)) {
    printExit('please change package.json/name to kebab-case')
  }
  const atr = pkg.author
  if (typeof atr === 'object') {
    pkg.authorName = atr.name || ''
    pkg.authorEmail = atr.email || ''
    if (pkg.authorEmail) {
      pkg.author = `${pkg.authorName} <${pkg.authorEmail}>`
    } else {
      pkg.author = pkg.authorName
    }
  } else {
    const mtd = /^(.+) <(.+)>$/.exec(atr)
    if (mtd && mtd.length >= 3) {
      pkg.authorName = mtd[1]
      pkg.authorEmail = mtd[2]
    } else {
      printExit('please change author to "name <xxx@xxx.xxx>" in package.json')
    }
  }
  if (!validator.isEmail(pkg.authorEmail)) {
    printExit('author email format error in package.json')
  }
  return pkg as PackageInfo
}
