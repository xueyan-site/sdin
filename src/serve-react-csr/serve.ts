import Koa from 'koa'
import { red, green } from 'chalk'
import { createKoa } from './koa'
import { printTask } from '../utils/console'
import { getPackageInfoSync } from '../utils/package'
import { precheckReactCSR, getReactCSRProjectConfigSync } from '../react-csr'
import type { PackageInfo } from '../utils/package'
import type { ReactCSRProjectConfig } from '../react-csr'
import type { Server } from 'http'

export interface  ServeReactCSRProps {
  root: string
  password?: string
}

export interface  ServeReactCSRResult {
  pkg: PackageInfo
  cfg: ReactCSRProjectConfig
  koa: Koa
  server: Server
}

export async function serveReactCSR(
  { root, password }:  ServeReactCSRProps
): Promise< ServeReactCSRResult> {
  const pkg = getPackageInfoSync(root)
  const cfg = getReactCSRProjectConfigSync(root, pkg)
  await precheckReactCSR(root, pkg)
  const koa = await createKoa(root, cfg, password)
  const origin = `http://127.0.0.1:${cfg.serve.port}${cfg.publicPath}`
  const server = await printTask({
    failed: `${cfg.name} compile ${red('failed')}`,
    success: `${cfg.name} compiler listening on ${green(origin)}`,
    task: () => new Promise<Server>(resolve => {
      const res = koa.listen(cfg.serve.port, () => resolve(res))
    })
  })
  return { pkg, cfg, koa, server }
}
