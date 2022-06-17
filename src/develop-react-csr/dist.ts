import { resolve } from 'path'
import { trimEnd } from 'lodash'
import koaMount from 'koa-mount'
import koaStatic from 'koa-static'
import type { Compiler } from 'webpack'
import type { Middleware, Context } from 'koa'
import type { ReactCSRProjectConfig } from '../react-csr'

export function getStaticMdw(
  root: string,
  cfg: ReactCSRProjectConfig
): Middleware<any, any> {
  return koaMount(
    trimEnd(cfg.assetsPath, '/'),
    koaStatic(resolve(root, 'pub/ast'))
  )
}

export function getPagesMdw(
  root: string,
  cfg: ReactCSRProjectConfig,
  compiler: Compiler
): Middleware<any, any> {
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
        const file = resolve(root, 'dist', page.html)
        ctx.set('content-type', 'text/html')
        ctx.body = await new Promise<any>((resolve, reject) => {
          compiler.outputFileSystem.readFile(file, (err, data) => {
            return err ? reject(err) : resolve(data)
          })
        })
      }
    }
  }
}
