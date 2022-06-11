import del from 'del'
import { resolve } from 'path'
import { red, blue, green } from 'chalk'
import { printTask } from '../utils/console'
import { getPackageInfoSync } from '../utils/package'
import { precheckPackage, getPackageProjectConfigSync, compilePackage } from '../package'
import type { PackageInfo } from '../utils/package'
import type { PackageProjectConfig } from '../package'

export interface BuildPackageProps {
  root: string
  noexit?: boolean   // 在出现错误后，不退出
  noblank?: boolean  // 在完成后，不追加空行
}

export interface BuildPackageResult {
  pkg: PackageInfo
  cfg: PackageProjectConfig
  time: number
}

export async function buildPackage(
  { root, noexit, noblank }: BuildPackageProps
): Promise<BuildPackageResult> {
  const pkg = getPackageInfoSync(root)
  const cfg = getPackageProjectConfigSync(root, pkg)
  await del(resolve(root, 'dist'))
  await precheckPackage(root, pkg)
  const time = await printTask({
    noexit,
    noblank,
    info: `${cfg.name} ${blue('building')}`,
    failed: `${cfg.name} built ${red('failed')}`,
    success: time => `${cfg.name} built ${green('successfully')}, total ${green(time + 'ms')}`,
    task: () => compilePackage(root, cfg)
  })
  return { pkg, cfg, time }
}
