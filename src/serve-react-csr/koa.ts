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
import koaCompress from 'koa-compress'
import koaBodyParser from 'koa-bodyparser'
import koaSend from 'koa-send'
import { createTracker } from './track'
import type { ReactCSRProjectConfig } from '../react-csr'

export async function createKoa(
  root: string,
  cfg: ReactCSRProjectConfig,
  pwd?: string // 服务器密码
): Promise<Koa> {
  const koa = new Koa()
  const dist = resolve(root, 'dist')
  if (cfg.develop.proxies.length > 0) {
    koa.use(koaCompose(cfg.develop.proxies.map(i => koaProxy(i))))
  }
  if (cfg.trackPath) {
    const tracker = await createTracker(cfg, pwd || '')
    if (tracker) {
      koa.use(tracker)
    }
  }
  koa.use(koaConditional())
  koa.use(koaETag())
  koa.use(koaCompress())
  koa.use(koaBodyParser())
  koa.use(getPageRouter(root, cfg))
  koa.use(koaMount(
    trimEnd(cfg.publicPath, '/') || '/',
    koaStatic(dist)
  ))
  koa.use(async ctx => {
    if (ctx.status >= 404 && cfg.error) {
      if ((ctx.headers.accept || '').includes('text/html')) {
        await koaSend(ctx, cfg.error.html, { root: dist })
      }
    }
  })
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
