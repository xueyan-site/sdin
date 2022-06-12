import { resolve } from 'path'
import { trimEnd } from 'lodash'
import Koa from 'koa'
import koaMount from 'koa-mount'
import koaProxy from 'koa-proxy'
import koaCompose from 'koa-compose'
import koaStatic from 'koa-static'
import KoaRouter from 'koa-router'
import koaConditional from 'koa-conditional-get'
import koaETag from 'koa-etag'
import koaBodyParser from 'koa-bodyparser'
import koaSend from 'koa-send'
import sslify from 'koa-sslify'
import { createTracker } from '../serves/track'
import type { ReactCSRProjectConfig } from '../react-csr'

export async function createKoa(
  root: string,
  cfg: ReactCSRProjectConfig
): Promise<Koa> {
  const koa = new Koa()
  const dist = resolve(root, 'dist')
  const serve = cfg.serve
  if (serve.SSLKey && serve.SSLCert) {
    koa.use(sslify({
      port: serve.port
    }))
  }
  if (serve.proxies.length > 0) {
    koa.use(koaCompose(serve.proxies.map(i => koaProxy(i))))
  }
  if (cfg.trackPath) {
    const tracker = await createTracker([cfg])
    if (tracker) {
      koa.use(koaBodyParser())
      koa.use(tracker)
    }
  }
  koa.use(koaConditional())
  koa.use(koaETag())
  koa.use(getPageRouter(root, cfg))
  koa.use(koaMount(
    trimEnd(cfg.publicPath, '/') || '/',
    koaStatic(dist, { maxAge: 2592000000 })
  ))
  if (cfg.error) {
    const errCfg = cfg.error
    const fileExp = /.+\.[0-9a-zA-Z]+$/
    koa.use(async ctx => {
      if (ctx.status >= 404 && !fileExp.test(ctx.path)) {
        if ((ctx.headers.accept || '').includes('text/html')) {
          await koaSend(ctx, errCfg.html, { root: dist })
        }
      }
    })
  }
  return koa
}

function getPageRouter(
  root: string, 
  cfg: ReactCSRProjectConfig
) {
  const router = new KoaRouter()
  const dist = resolve(root, 'dist')
  const { pageList, index, publicPath } = cfg
  pageList.forEach(pgCfg => {
    router.get(pgCfg.path, ctx => {
      return koaSend(ctx, pgCfg.html, { root: dist })
    })
  })
  if (index) {
    router.get(trimEnd(publicPath, '/') || '/', ctx => {
      return koaSend(ctx, index.html, { root: dist })
    })
  }
  return koaCompose([
    router.routes(),
    router.allowedMethods()
  ])
}
