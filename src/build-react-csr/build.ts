import del from 'del'
import { resolve } from 'path'
import { red, green } from 'chalk'
import { createCompiler } from './webpack'
import { printTask } from '../utils/console'
import { getPackageInfoSync } from '../utils/package'
import { precheckReactCSR, getReactCSRProjectConfigSync, handleAssets } from '../react-csr'
import type { Compiler, Stats } from 'webpack'
import type { PackageInfo } from '../utils/package'
import type { ReactCSRProjectConfig } from '../react-csr'

export interface BuildReactCSRProps {
  root: string
}

export interface BuildReactCSRResult {
  pkg: PackageInfo
  cfg: ReactCSRProjectConfig
  stats?: Stats
  compiler: Compiler
}

export async function buildReactCSR(
  { root }: BuildReactCSRProps
): Promise<BuildReactCSRResult> {
  const pkg = getPackageInfoSync(root)
  const cfg = getReactCSRProjectConfigSync(root, pkg)
  await del(resolve(root, 'dist'))
  await del(resolve(root, 'buf/entry'))
  await precheckReactCSR(root, pkg)
  const compiler = await createCompiler(root, pkg, cfg)
  const stats = await printTask({
    failed: `${cfg.name} built ${red('failed')}`,
    success: `${cfg.name} built ${green('successfully')}`,
    task: async () => {
      await handleAssets(root)
      return new Promise<Stats|undefined>((resolve, reject) => {
        compiler.run((error?: Error, stats?: Stats) => {
          if (error) {
            reject(error)
          } else if (stats && stats.hasErrors()) {
            reject(stats.toString('errors-only'))
          } else {
            resolve(stats)
          }
        })
      })
    }
  })
  if (stats) {
    console.log(stats.toString({
      all: false,
      colors: true,
      version: true,
      timings: true,
      builtAt: true,
      assets: true,
      children: true,
      warnings: true,
      errors: true
    }))
    console.log()
  }
  return { pkg, cfg, stats, compiler }
}
