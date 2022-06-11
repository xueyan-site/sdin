import gulp from 'gulp'
import { resolve } from 'path'
import { red, blue, green } from 'chalk'
import { printTask } from '../utils/console'
import { compilePackage } from '../package'
import { buildPackage } from '../build-package'
import type { FSWatcher } from 'fs'
import type { PackageInfo } from '../utils/package'
import type { PackageProjectConfig } from '../package'

export interface DevelopPackageProps {
  root: string
}

export interface DevelopPackageResult {
  pkg: PackageInfo
  cfg: PackageProjectConfig
  watcher: FSWatcher
}

export async function developPackage(
  { root }: DevelopPackageProps
): Promise<DevelopPackageResult> {
  const { cfg, pkg } = await buildPackage({ 
    root,
    noexit: true,
    noblank: true
  })
  // 处理文件变动
  const handleFileUpdated = (path: string) => {
    const pathDesc = 'src/' + path
    printTask({
      noexit: true,
      noblank: true,
      info: `${pathDesc} ${blue('rebuilding')}`,
      failed: `${pathDesc} rebuilt ${red('failed')}`,
      success: time => `${pathDesc} rebuilt ${green('successfully')}, total ${green(time + 'ms')}`,
      task: () => compilePackage(root, cfg, file => file.path.includes(path))
    })
  }
  // 执行 watch 相关逻辑
  const watcher = gulp.watch('**/*', { cwd: resolve(root, 'src') })
  watcher.on('addDir', handleFileUpdated)
  watcher.on('change', handleFileUpdated)
  return { cfg, pkg, watcher }
}
