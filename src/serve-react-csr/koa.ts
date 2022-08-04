import Koa from 'koa'
import koaLogger from 'koa-logger'
import sslify from 'koa-sslify'
import koaProxy from 'koa-proxy'
import koaBodyParser from 'koa-bodyparser'
import koaConditional from 'koa-conditional-get'
import koaETag from 'koa-etag'
import { getTrackRouter } from '../serve/track'
import { getStaticMdw, getPagesMdw } from './dist'
import type { ReactCSRProjectConfig } from '../react-csr'

export async function createKoa({
  root,
  log,
  cfg
}: {
  root: string
  log?: boolean
  cfg: ReactCSRProjectConfig
}): Promise<Koa> {
  const koa = new Koa()
  const serve = cfg.serve
  if (log) {
    koa.use(koaLogger())
  }
  if (serve.SSLKey && serve.SSLCert) {
    koa.use(sslify({
      port: serve.port
    }))
  }
  serve.proxies.forEach(i => {
    koa.use(koaProxy(i))
  })
  if (cfg.trackPath) {
    const router = await getTrackRouter([cfg])
    if (router) {
      koa.use(koaBodyParser())
      koa.use(router.routes())
      koa.use(router.allowedMethods())
    }
  }
  koa.use(koaConditional())
  koa.use(koaETag())
  koa.use(getStaticMdw(root, cfg))
  koa.use(getPagesMdw(root, cfg))
  return koa
}
