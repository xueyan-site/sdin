import { resolve } from 'path'
import { existsSync, statSync, readdirSync } from 'fs-extra'
import { printExit } from '../utils/console'
import { getJsonSync } from '../utils/read'
import { getPackageInfoSync } from '../utils/package'
import { getReactCSRProjectConfigSync } from '../react-csr'
import type { PackageInfo } from '../utils/package'
import type { ReactCSRProjectConfig } from '../react-csr'

function search(path: string, result: string[] = []) {
  if (statSync(path).isDirectory()) {
    if (existsSync(resolve(path, 'project.js'))) {
      result.push(path)
    }
    const files = readdirSync(path)
    for (let i = 0; i < files.length; i++) {
      const name = files[i]
      if (!/^(buf|dist|pub|src|node_modules|\.)$/g.test(name)) {
        search(resolve(path, name), result)
      }
    }
  }
  return result
}

export interface AppInfo {
  root: string
  pkg: PackageInfo
  cfg: ReactCSRProjectConfig
}

export function searchApps(root: string): AppInfo[] {
  if (!existsSync(root)) {
    printExit('read failed: ' + root)
  }
  const apps: AppInfo[] = []
  search(root).forEach(item => {
    const cfg = getJsonSync(resolve(item, 'project.js'), true)
    const pkg = getPackageInfoSync(item)
    if (cfg.type === 'react-csr') {
      apps.push({
        root: item,
        pkg,
        cfg: getReactCSRProjectConfigSync(item, pkg)
      })
    }
  })
  return apps.sort((a, b) => {
    return a.cfg.publicPath > b.cfg.publicPath ? -1 : 1
  })
}
