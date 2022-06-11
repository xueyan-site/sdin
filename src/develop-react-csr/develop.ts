import Koa from 'koa'
import { red, green } from 'chalk'
import { createKoa } from './koa'
import { createCompiler } from './webpack'
import { printTask } from '../utils/console'
import { getPackageInfoSync } from '../utils/package'
import { precheckReactCSR, getReactCSRProjectConfigSync } from '../react-csr'
import type { Compiler } from 'webpack'
import type { PackageInfo } from '../utils/package'
import type { ReactCSRProjectConfig } from '../react-csr'
import type { Server } from 'http'

export interface DevelopReactCSRProps {
  root: string
}

export interface DevelopReactCSRResult {
  pkg: PackageInfo
  cfg: ReactCSRProjectConfig
  koa: Koa
  server: Server
  compiler: Compiler
}

export async function developReactCSR(
  { root }: DevelopReactCSRProps
): Promise<DevelopReactCSRResult> {
  const pkg = getPackageInfoSync(root)
  const cfg = getReactCSRProjectConfigSync(root, pkg)
  await precheckReactCSR(root, pkg)
  const compiler = await createCompiler(root, pkg, cfg)
  const koa = createKoa(root, cfg, compiler)
  const origin = `http://127.0.0.1:${cfg.develop.port}${cfg.publicPath}`
  const server = await printTask({
    failed: `${cfg.name} compile ${red('failed')}`,
    success: `${cfg.name} compiler listening on ${green(origin)}`,
    task: () => new Promise<Server>(resolve => {
      const res = koa.listen(cfg.develop.port, () => resolve(res))
    })
  })
  return { pkg, cfg, koa, server, compiler }
}
