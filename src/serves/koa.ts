import { resolve } from 'path'
import { trimEnd } from 'lodash'
import Koa from 'koa'
import sslify from 'koa-sslify'
import koaMount from 'koa-mount'
import koaProxy from 'koa-proxy'
import koaCompose from 'koa-compose'
import koaStatic from 'koa-static'
import KoaRouter from 'koa-router'
import koaConditional from 'koa-conditional-get'
import koaETag from 'koa-etag'
import koaBodyParser from 'koa-bodyparser'
import koaSend from 'koa-send'
import { createTracker } from './track'
import type { Middleware, Context } from 'koa'
import type { Options as ProxyOptions } from 'koa-proxy'
import type { AppInfo } from './apps'

export async function createKoa(
  apps: AppInfo[],
  port: number,
  SSLKey?: string,
  SSLCert?: string
): Promise<Koa> {
  const koa = new Koa()
  if (SSLKey && SSLCert) {
    koa.use(sslify({ port }))
  }
  const proxies = apps.reduce<ProxyOptions[]>(
    (p, c) => p.concat(c.cfg.serve.proxies), []
  )
  if (proxies.length > 0) {
    koa.use(koaCompose(proxies.map(i => koaProxy(i))))
  }
  const tracker = await createTracker(apps.map(i => i.cfg))
  if (tracker) {
    koa.use(koaBodyParser())
    koa.use(tracker)
  }
  koa.use(koaConditional())
  koa.use(koaETag())
  koa.use(getPageRouter(apps))
  koa.use(getAssetsServe(apps))
  koa.use(getErrorHandler(apps))
  return koa
}

function getPageRouter(apps: AppInfo[]) {
  const router = new KoaRouter()
  apps.forEach(app => {
    const dist = resolve(app.root, 'dist')
    const { pageList, index, publicPath } = app.cfg
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
  })
  return koaCompose([
    router.routes(),
    router.allowedMethods()
  ])
}

function getAssetsServe(apps: AppInfo[]) {
  const mws: Middleware<any, any>[] = []
  apps.forEach(app => {
    const dist = resolve(app.root, 'dist')
    mws.push(koaMount(
      trimEnd(app.cfg.publicPath, '/') || '/',
      koaStatic(dist, { maxAge: 2592000000 })
    ))
  })
  return koaCompose(mws)
}

function getErrorHandler(apps: AppInfo[]) {
  const fileExp = /.+\.[0-9a-zA-Z]+$/
  return async (ctx: Context) => {
    if (ctx.status >= 404 && !fileExp.test(ctx.path)) {
      if ((ctx.headers.accept || '').includes('text/html')) {
        const app = apps.find(i => {
          return ctx.path.startsWith(trimEnd(i.cfg.publicPath, '/'))
        })
        if (app) {
          const errCfg = app.cfg.error
          if (errCfg) {
            await koaSend(ctx, errCfg.html, { 
              root: resolve(app.root, 'dist')
            })
          }
        }
      }
    }
  }
}
