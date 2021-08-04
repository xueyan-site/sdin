import Koa, { Context } from 'koa'
import koaCompose from 'koa-compose'
import KoaRouter from 'koa-router'
import e2k from 'express-to-koa'
import wdm from 'webpack-dev-middleware'
import whm from 'webpack-hot-middleware'
import { Compiler } from 'webpack'
import ReactCSR from 'pro/react-csr'
import { webStatic, webError, webProxy } from '../common/server'
import ReactCSRPage from 'pro/react-csr-page'

/**
 * 创建服务器
 */
export async function createServer(project: ReactCSR, compiler: Compiler) {
  const server = new Koa()
  server.use(webProxy({
    proxies: project.start.proxies
  }))
  server.use(webError({
    project,
    reader: (ctx, page) => {
      return pageReader(ctx, page, project, compiler)
    }
  }))
  server.use(webStatic({
    prefix: project.path,
    dist: project.astPub,
    extensions: ['html','json']
  }))
  server.use(pageBuilder(project, compiler))
  server.use(pageReloader(compiler))
  server.use(pageRoutes(project, compiler))
  return server
}

/**
 * 页面处理器
 */
async function pageReader(ctx: Context, page: ReactCSRPage, project: ReactCSR, compiler: Compiler) {
  const filePath = project.withDist('web', page.path + '.html')
  ctx.set('content-type', 'text/html')
  ctx.body = await new Promise<string|Buffer|undefined>((resolve, reject) => {
    compiler.outputFileSystem.readFile(filePath, (err, data) => {
      return err ? reject(err) : resolve(data)
    })
  })
}

/**
 * 页面构建器中间件
 */
function pageBuilder(project: ReactCSR, compiler: Compiler) {
  return e2k(wdm(compiler as any, {
    stats: 'errors-warnings',
    publicPath: project.path
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
    router.get(page.path, ctx => pageReader(ctx, page, project, compiler))
  })
  // 设置项目url的根路径对应的路由
  const page = project.getPage(project.index)
  if (page) {
    router.get('/', ctx => pageReader(ctx, page, project, compiler))
  }
  return koaCompose([
    router.routes(),
    router.allowedMethods()
  ])
}
