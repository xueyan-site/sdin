import Koa from 'koa'
import http from 'http'
import { red, green } from 'chalk'
import { createKoa } from './koa'
import { createCompiler } from './webpack'
import { printTask } from '../utils/console'
import { getPackageInfoSync } from '../utils/package'
import { precheckReactCSR, getReactCSRProjectConfigSync } from '../react-csr'
import type { Server } from 'http'
import type { Compiler } from 'webpack'
import type { PackageInfo } from '../utils/package'
import type { ReactCSRProjectConfig } from '../react-csr'

export interface DevelopReactCSRProps {
  root: string
  /** 指定端口（优先级高于配置） */
  port?: number
}

export interface DevelopReactCSRResult {
  pkg: PackageInfo
  cfg: ReactCSRProjectConfig
  koa: Koa
  server: Server
  compiler: Compiler
}

export async function developReactCSR(
  { root, port }: DevelopReactCSRProps
): Promise<DevelopReactCSRResult> {
  const pkg = getPackageInfoSync(root)
  const cfg = getReactCSRProjectConfigSync(root, pkg)
  const develop = cfg.develop
  if (port) {
    develop.port = port
  }
  await precheckReactCSR(root, pkg)
  const compiler = await createCompiler(root, pkg, cfg)
  const koa = createKoa(root, cfg, compiler)
  const server = http.createServer(koa.callback())
  const origin = `http://127.0.0.1:${develop.port}${cfg.publicPath}`
  await printTask({
    failed: `${cfg.name} compile ${red('failed')}`,
    success: `${cfg.name} listening on ${green(origin)}`,
    task: () => new Promise<void>(res => {
      server.listen(develop.port, () => res())
    })
  })
  return { pkg, cfg, koa, server, compiler }
}
