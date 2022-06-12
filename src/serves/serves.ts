import Koa from 'koa'
import http from 'http'
import https from 'https'
import { resolve } from 'path'
import { red, green, blue } from 'chalk'
import { readFileSync } from 'fs-extra'
import { createKoa } from './koa'
import { printTask } from '../utils/console'
import { searchApps } from './apps'
import type { Server } from 'http'
import type { AppInfo } from './apps'

export interface  ServesProps {
  root: string
  /** 指定端口 */
  port?: number
  /** SSL 私钥文件路径 */
  SSLKey?: string
  /** SSL 证书文件路径 */
  SSLCert?: string
}

export interface  ServesResult {
  apps: AppInfo[]
  koa: Koa
  server: Server
}

export async function serves(
  { root, port: _port, SSLKey, SSLCert }:  ServesProps
): Promise<ServesResult> {
  const port = _port || ((SSLKey && SSLCert) ? 443 : 80)
  const apps = searchApps(root)
  const koa = await createKoa(apps, port, SSLKey, SSLCert)
  const server = (!SSLKey || !SSLCert)
    ? http.createServer(koa.callback())
    : https.createServer({
        key: readFileSync(resolve(root, SSLKey)),
        cert: readFileSync(resolve(root, SSLCert))
      }, koa.callback())
  const origin = `http://127.0.0.1:${port}`
  console.log('applications:')
  console.log(apps.map(i => `- ${blue(i.cfg.name)} ${green(i.cfg.publicPath)} ${i.root}`).join('\n'))
  console.log()
  await printTask({
    failed: `server serve ${red('failed')}`,
    success: `server listening on ${green(origin)}`,
    task: () => new Promise<void>(res => {
      server.listen(port, () => res())
    })
  })
  return { apps, koa, server }
}
