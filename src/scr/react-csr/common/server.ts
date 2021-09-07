import Koa from 'koa'
import koaMount from 'koa-mount'
import koaProxy from 'koa-proxy'
import koaCompose from 'koa-compose'
import koaStatic from 'koa-static'
import KoaRouter from 'koa-router'
import type { Context, Next, Middleware } from 'koa'
import type { Options as ProxyOptions } from 'koa-proxy'
import type { Options } from 'koa-static'
import type ReactCSR from 'pro/react-csr'
import type ReactCSRPage from 'pro/react-csr-page'

export type Middlewarer = () => PromiseOrNot<Middleware<any, any> | undefined>

/**
 * 使用中间件创建器（若没有创建中间件，则不应用）
 */
export async function useMiddlewarer(server: Koa, creator: Middlewarer) {
  const middleware = await creator()
  if (middleware) {
    server.use(middleware)
  }
}

export type RouteConfig = [keyof KoaRouter, ...any[]]

export type RoutesResult = PromiseOrNot<(RouteConfig | undefined)[] | undefined>

/**
 * 使用路由（若路由器列表不存在，则不应用）
 */
export async function useRoutes(server: Koa, routesList: RoutesResult[]) {
  const routeList: RouteConfig[] = []
  const results = await Promise.all(routesList)
  results.forEach(routes => {
    if (routes) {
      routes.forEach(route => {
        if (route) {
          routeList.push(route)
        }
      })
    }
  })
  if (routeList.length > 0) {
    const router = new KoaRouter()
    routeList.forEach(([key, ...args]) => {
      const method: any = router[key]
      if (typeof method === 'function') {
        method.apply(router, args)
      }
    })
    server.use(koaCompose([
      router.routes(),
      router.allowedMethods()
    ]))
  }
}

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
export function webError({ project, reader }: WebErrorOptions) {
  const page = project.error
  return async (ctx: Context, next: Next) => {
    try {
      await next()
      if (ctx.status >= 400) {
        throw new Error()
      }
    } catch (error) {
      if (page && reader) {
        await reader(ctx, page, error)
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
