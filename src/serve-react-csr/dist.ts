import { resolve } from 'path'
import { trimEnd } from 'lodash'
import koaMount from 'koa-mount'
import koaStatic from 'koa-static'
import koaSend from 'koa-send'
import type { Middleware, Context } from 'koa'
import type { ReactCSRProjectConfig } from '../react-csr'

export function getStaticMdw(
  root: string,
  cfg: ReactCSRProjectConfig,
): Middleware<any, any> {
  return koaMount(
    trimEnd(cfg.publicPath, '/') || '/',
    koaStatic(resolve(root, 'dist'), {
      maxAge: 2592000000 
    })
  )
}

export function getPagesMdw(
  root: string,
  cfg: ReactCSRProjectConfig,
): Middleware<any, any> {
  const dist = resolve(root, 'dist')
  const pub = trimEnd(cfg.publicPath, '/') || '/'
  return async (ctx: Context) => {
    if (
      (ctx.method === 'HEAD' || ctx.method === 'GET') &&
      (!ctx.body && ctx.status === 404) &&
      (ctx.headers.accept?.includes('text/html'))
    ) {
      const path = trimEnd(ctx.path, '/') || '/'
      const page = (path === pub && cfg.index)
        || cfg.pageList.find(i => i.path === path)
        || cfg.error
      if (page) {
        try {
          await koaSend(ctx, page.html, { root: dist })
        } catch (err: any) {
          if (err.status !== 404) {
            throw err
          }
        }
      }
    }
  }
}
