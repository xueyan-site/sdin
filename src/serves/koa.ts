import Koa from 'koa'
import koaLogger from 'koa-logger'
import sslify from 'koa-sslify'
import koaProxy from 'koa-proxy'
import koaBodyParser from 'koa-bodyparser'
import koaConditional from 'koa-conditional-get'
import koaETag from 'koa-etag'
import { getTrackRouter } from '../serve/track'
import { getAppDistMdw } from './dist'
import type { AppInfo } from './apps'

export async function createKoa({
  apps,
  log,
  port,
  SSLKey,
  SSLCert
}: {
  apps: AppInfo[]
  log?: boolean
  port: number
  SSLKey?: string
  SSLCert?: string
}): Promise<Koa> {
  const koa = new Koa()
  if (log) {
    koa.use(koaLogger())
  }
  if (SSLKey && SSLCert) {
    koa.use(sslify({ port }))
  }
  apps.forEach(app => {
    app.cfg.serve.proxies.forEach(i => {
      koa.use(koaProxy(i))
    })
  })
  const router = await getTrackRouter(apps.map(i => i.cfg))
  if (router) {
    koa.use(koaBodyParser())
    koa.use(router.routes())
    koa.use(router.allowedMethods())
  }
  koa.use(koaConditional())
  koa.use(koaETag())
  koa.use(getAppDistMdw(apps))
  return koa
}
