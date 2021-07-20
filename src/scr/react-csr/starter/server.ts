import Koa, { Context, Next } from 'koa'
import koaConditional from 'koa-conditional-get'
import koaETag from 'koa-etag'
import koaCompose from 'koa-compose'
import KoaRouter from 'koa-router'
import e2k from 'express-to-koa'
import wdm from 'webpack-dev-middleware'
import whm from 'webpack-hot-middleware'
import { Compiler } from 'webpack'
import ReactCSR from 'pro/react-csr'
import { webStatic } from '../common/server'
import ReactCSRPage from 'pro/react-csr-page'

/**
 * 创建服务器
 */
export async function createServer(project: ReactCSR, compiler: Compiler) {
  const server = new Koa()
  server.use(koaConditional())
  server.use(koaETag())
  server.use(webStatic(project.path, project.astPub))
  server.use(pageError(project, compiler))
  server.use(pageBuilder(project, compiler))
  server.use(pageReloader(compiler))
  server.use(pageRoutes(project, compiler))
  return server
}

/**
 * 页面构建器中间件
 */
function pageBuilder(project: ReactCSR, compiler: Compiler) {
  return e2k(wdm(compiler as any, {
    publicPath: project.path,
    stats: 'errors-warnings'
  }))
}

/**
 * 页面热刷新中间件
 */
function pageReloader(compiler: Compiler) {
  return e2k(whm(compiler as any))
}

/**
 * 页面路由中间件
 */
function pageRoutes(project: ReactCSR, compiler: Compiler) {
  const { pageList } = project
  const router = new KoaRouter({
    prefix: project.path
  })
  // 设置项目各页面路径对应的路由
  pageList.forEach(page => {
    router.get(page.path, createPageReader(page, project, compiler))
  })
  // 设置项目url的根路径对应的路由
  const page = project.getPage(project.index)
  if (page) {
    router.get('/', createPageReader(page, project, compiler))
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
 * @param compiler 
 * @returns 
 */
function createPageReader(page: ReactCSRPage, project: ReactCSR, compiler: Compiler) {
  return async (ctx: Context) => {
    const filePath = project.withDist('web', page.path + '.html')
    const data = await new Promise<string|Buffer|undefined>((resolve, reject) => {
      compiler.outputFileSystem.readFile(filePath, (err, data) => {
        return err ? reject(err) : resolve(data)
      })
    })
    ctx.set('content-type', 'text/html')
    ctx.body = data
  }
}

/**
 * 错误页面中间件
 */
function pageError(project: ReactCSR, compiler: Compiler) {
  const page = project.getPage(project.error)
  const reader = page && createPageReader(page, project, compiler)
  return async (ctx: Context, next: Next) => {
    await next()
    if (ctx.status >= 400) {
      if (reader) {
        await reader(ctx)
      } else {
        ctx.set('content-type', 'text/html')
        ctx.body = 'Not Found'
      }
    }
  }
}
