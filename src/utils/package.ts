import validator from 'validator'
import { resolve } from 'path'
import { execSync } from 'child_process'
import { existsSync } from 'fs-extra'
import { getJsonSync } from './read'
import { printExit, printTask } from './console'

export interface PackageInfo extends Record<string, any> {
  /** 包名称 */
  name: string
  /** 版本 */
  version: string
  /** "xxx <xxx@xxx.xxx>"*/
  author: string
  /** "xxx" */
  authorName: string
  /** "xxx@xxx.xxx" */ 
  authorEmail: string
}

/**
 * 根据文件夹目录，获取包的信息
 */
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

export function downloadModules(root: string) {
  if (!existsSync(root)) {
    return
  }
  printTask({
    color: true,
    info: `download modules to ${root}`,
    failed: `modules download to ${root} failed`,
    success: `modules downloaded to ${root} successfully`,
    task: () => {
      execSync(`cd ${root} && npm install`, {
        stdio: 'inherit'
      })
    }
  })
}

export function getDepVersion(pkg: PackageInfo, dep: string): string {
  return (pkg.dependencies || {})[dep] 
    || (pkg.devDependencies || {})[dep] 
    || ''
}
