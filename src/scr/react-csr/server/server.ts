import Koa from 'koa'
import koaConditional from 'koa-conditional-get'
import koaETag from 'koa-etag'
import koaCompose from 'koa-compose'
import koaCompress from 'koa-compress'
import koaMount from 'koa-mount'
import koaStatic from 'koa-static'
import KoaRouter from 'koa-router'
import koaSend from 'koa-send'
import ReactCSR from 'pro/react-csr'

/**
 * 创建服务器
 */
export function createServer(project: ReactCSR) {
  const server = new Koa()
  server.use(koaConditional())
  server.use(koaETag())
  server.use(koaCompress())
  server.use(koaMount(project.path, koaStatic(project.astDist)))
  server.use(koaMount(project.path, koaStatic(project.webDist)))
  const router = createRouter(project)
  server.use(koaCompose([
    router.routes(),
    router.allowedMethods()
  ]))
  return server
}

/**
 * 创建路由器
 */
function createRouter(project: ReactCSR) {
  const { pageList } = project
  const router = new KoaRouter({
    prefix: project.path
  })
  // 设置项目各页面路径对应的路由
  pageList.forEach(page => {
    router.get(page.path, ctx => {
      return koaSend(ctx, page.path + '.html', {
        root: project.webDist
      })
    })
  })
  // 设置项目url的根路径对应的路由
  if (project.index) {
    const page = pageList.find(page => page.path === project.index)
    if (page) {
      router.get('/', ctx => {
        return koaSend(ctx, page.path + '.html', {
          root: project.webDist
        })
      })
    }
  }
  return router
}
