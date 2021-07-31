import { Context, Next } from 'koa'
import koaMount from 'koa-mount'
import koaProxy, { Options as ProxyOptions } from 'koa-proxy'
import koaCompose from 'koa-compose'
import koaStatic, { Options } from 'koa-static'
import ReactCSR from 'pro/react-csr'
import ReactCSRPage from 'pro/react-csr-page'

export interface WebStaticOptions extends Omit<Options, 'maxage'> {
  // 资源目录
  dist: string
  // 访问路径前缀
  prefix?: string
}

/**
 * 网站静态资源
 */
export function webStatic(options: WebStaticOptions) {
  if (options.maxAge === undefined) {
    options.maxAge = 31536000000 // 一年
  }
  if (options.maxAge) {
    options.immutable = true
  }
  if (!options.root) {
    options.root = options.dist
  }
  const mdw = koaStatic(options.dist, options)
  if (options.prefix) {
    return koaMount(options.prefix, mdw)
  } else {
    return mdw
  }
}

interface WebErrorOptions {
  project: ReactCSR
  reader?: (ctx: Context, page: ReactCSRPage, error: any) => Promise<any>
}

/**
 * 网站错误兜底
 */
export function webError(options: WebErrorOptions) {
  const page = options.project.getPage(options.project.error)
  return async (ctx: Context, next: Next) => {
    try {
      await next()
      if (ctx.status >= 400) {
        throw new Error()
      }
    } catch (error) {
      if (page && options.reader) {
        await options.reader(ctx, page, error)
      } else {
        ctx.set('content-type', 'text/html')
        ctx.body = error?.message
      }
    }
  }
}

interface WebProxyOptions {
  proxies: ProxyOptions[]
}

/**
 * 网站代理
 */
export function webProxy(options: WebProxyOptions) {
  return koaCompose(options.proxies.map(i => koaProxy(i)))
}
