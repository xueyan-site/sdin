import { resolve } from 'path'
import { trimEnd } from 'lodash'
import Koa from 'koa'
import koaMount from 'koa-mount'
import koaProxy from 'koa-proxy'
import koaCompose from 'koa-compose'
import koaStatic from 'koa-static'
import KoaRouter from 'koa-router'
import e2k from 'express-to-koa'
import wdm from 'webpack-dev-middleware'
import whm from 'webpack-hot-middleware'
import type { Context } from 'koa'
import type { Compiler } from 'webpack'
import type { ReactCSRPageConfig, ReactCSRProjectConfig } from '../react-csr'

export function createKoa(
  root: string,
  cfg: ReactCSRProjectConfig, 
  compiler: Compiler
): Koa {
  const koa = new Koa()
  if (cfg.develop.proxies.length > 0) {
    koa.use(koaCompose(cfg.develop.proxies.map(i => koaProxy(i))))
  }
  koa.use(e2k(wdm(compiler, {
    stats: 'errors-warnings',
    publicPath: cfg.publicPath
  })))
  koa.use(e2k(whm(compiler)))
  koa.use(getPageRouter(root, cfg, compiler))
  koa.use(koaMount(
    trimEnd(cfg.assetsPath, '/'),
    koaStatic(resolve(root, 'pub/ast'))
  ))
  koa.use(async ctx => {
    if (ctx.status >= 404 && cfg.error) {
      if ((ctx.headers.accept || '').includes('text/html')) {
        await readPageFile(ctx, root, cfg.error, compiler)
      }
    }
  })
  return koa
}

function getPageRouter(
  root: string, 
  cfg: ReactCSRProjectConfig, 
  compiler: Compiler
) {
  const router = new KoaRouter()
  const { pageList, index, publicPath } = cfg
  pageList.forEach(pgCfg => {
    router.get(pgCfg.path, ctx => {
      return readPageFile(ctx, root, pgCfg, compiler)
    })
  })
  if (index) {
    router.get(trimEnd(publicPath, '/') || '/', ctx => {
      return readPageFile(ctx, root, index, compiler)
    })
  }
  return koaCompose([
    router.routes(),
    router.allowedMethods()
  ])
}

async function readPageFile(
  ctx: Context, 
  root: string, 
  pgCfg: ReactCSRPageConfig, 
  compiler: Compiler
) {
  const file = resolve(root, 'dist', pgCfg.html)
  ctx.set('content-type', 'text/html')
  ctx.body = await new Promise<any>((resolve, reject) => {
    compiler.outputFileSystem.readFile(file, (err, data) => {
      return err ? reject(err) : resolve(data)
    })
  })
}
