import Koa from 'koa'
import http from 'http'
import https from 'https'
import { resolve } from 'path'
import { red, green } from 'chalk'
import { readFileSync } from 'fs-extra'
import { createKoa } from './koa'
import { printTask } from '../utils/console'
import { getPackageInfoSync } from '../utils/package'
import { getReactCSRProjectConfigSync } from '../react-csr'
import type { Server } from 'http'
import type { PackageInfo } from '../utils/package'
import type { ReactCSRProjectConfig } from '../react-csr'

export interface  ServeReactCSRProps {
  root: string
  /** 启用日志 */
  log?: boolean
  /** 指定端口（优先级高于配置） */
  port?: number
}

export interface  ServeReactCSRResult {
  pkg: PackageInfo
  cfg: ReactCSRProjectConfig
  koa: Koa
  server: Server
}

export async function serveReactCSR(
  { root, log, port }:  ServeReactCSRProps
): Promise< ServeReactCSRResult> {
  const pkg = getPackageInfoSync(root)
  const cfg = getReactCSRProjectConfigSync(root, pkg)
  const serve = cfg.serve
  if (port) {
    serve.port = port
  }
  const koa = await createKoa({ root, log, cfg })
  const useSSl = Boolean(serve.SSLKey && serve.SSLCert)
  const server = !useSSl
    ? http.createServer(koa.callback())
    : https.createServer({
        key: readFileSync(resolve(root, serve.SSLKey || '')),
        cert: readFileSync(resolve(root, serve.SSLCert || ''))
      }, koa.callback())
  const origin = `${useSSl ? 'https' : 'http'}://127.0.0.1:${serve.port}${cfg.publicPath}`
  await printTask({
    failed: `${cfg.name} serve ${red('failed')}`,
    success: `${cfg.name} listening on ${green(origin)}`,
    task: () => new Promise<void>(res => {
      server.listen(serve.port, () => res())
    })
  })
  return { pkg, cfg, koa, server }
}
