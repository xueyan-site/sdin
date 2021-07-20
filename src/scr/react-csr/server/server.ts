import Koa, { Context, Next } from 'koa'
import koaConditional from 'koa-conditional-get'
import koaETag from 'koa-etag'
import koaCompose from 'koa-compose'
import koaCompress from 'koa-compress'
import KoaRouter from 'koa-router'
import koaSend from 'koa-send'
import { webStatic } from '../common/server'
import ReactCSR from 'pro/react-csr'
import ReactCSRPage from 'pro/react-csr-page'

/**
 * 创建服务器
 */
export function createServer(project: ReactCSR) {
  const server = new Koa()
  server.use(koaConditional())
  server.use(koaETag())
  server.use(koaCompress())
  server.use(webStatic(project.path, project.astDist))
  server.use(webStatic(project.path, project.webDist))
  server.use(pageError(project))
  server.use(pageRoutes(project))
  return server
}

/**
 * 页面路由中间件
 */
function pageRoutes(project: ReactCSR) {
  const { pageList } = project
  const router = new KoaRouter({
    prefix: project.path
  })
  // 设置项目各页面路径对应的路由
  pageList.forEach(page => {
    router.get(page.path, createPageReader(page, project))
  })
  // 设置项目url的根路径对应的路由
  if (project.index) {
    const page = pageList.find(page => page.path === project.index)
    if (page) {
      router.get('/', createPageReader(page, project))
    }
  }
  return koaCompose([
    router.routes(),
    router.allowedMethods()
  ])
}

/**
 * 创建页面处理器
 * @param page 
 * @param project 
 * @returns 
 */
function createPageReader(page: ReactCSRPage, project: ReactCSR) {
  return async (ctx: Context) => {
    return koaSend(ctx, page.path + '.html', {
      root: project.webDist
    })
  }
}

/**
 * 错误页面中间件
 */
function pageError(project: ReactCSR) {
  const page = project.getPage(project.error)
  const reader = page
    ? createPageReader(page, project)
    : (ctx: Context) => {
        ctx.set('content-type', 'text/html')
        ctx.body = 'Not Found'
      }
  return async (ctx: Context, next: Next) => {
    await next()
    if (ctx.status >= 400) {
      reader(ctx)
    }
  }
}
