import koaCompose from 'koa-compose'
import KoaRouter from 'koa-router'
import e2k from 'express-to-koa'
import wdm from 'webpack-dev-middleware'
import whm from 'webpack-hot-middleware'
import { trimEnd } from 'lodash'
import type { Context } from 'koa'
import type { Compiler } from 'webpack'
import type { ReactCSR } from 'pro/react-csr'
import type { ReactCSRPage } from 'pro/react-csr-page'

/**
 * 页面路由器
 */
export function pageRouter(project: ReactCSR, compiler: Compiler) {
  const { pageList, index } = project
  const router = new KoaRouter()
  // 应用路由方法
  pageList.forEach(page => {
    router.get(page.path, ctx => readPage(ctx, page, project, compiler))
  })
  if (index) {
    const idxPath = trimEnd(project.publicPath, '/') || '/'
    router.get(idxPath, ctx => readPage(ctx, index, project, compiler))
  }
  return koaCompose([
    router.routes(),
    router.allowedMethods()
  ])
}

/**
 * 页面处理器
 */
export async function readPage(ctx: Context, page: ReactCSRPage, project: ReactCSR, compiler: Compiler) {
  const filePath = project.withDist(page.id + '.html')
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
export function pageBuilder(project: ReactCSR, compiler: Compiler) {
  return e2k(wdm(compiler as any, {
    stats: 'errors-warnings',
    publicPath: project.publicPath
  }))
}

/**
 * 页面热刷新中间件
 */
export function pageReloader(compiler: Compiler) {
  return e2k(whm(compiler as any))
}
