import Koa from 'koa'
import koaConditional from 'koa-conditional-get'
import koaETag from 'koa-etag'
import koaCompress from 'koa-compress'
import koaBodyParser from 'koa-bodyparser'
import koaSend from 'koa-send'
import { useRoutes, webStatic, webError, webProxy } from '../common/server'
import { createTracker } from './tracker'
import type ReactCSR from 'pro/react-csr'

interface ServerOptions {
  /**
   * 服务器密码
   */
  password: string
}

/**
 * 创建服务器
 */
export async function createServer(project: ReactCSR, options: ServerOptions) {
  const server = new Koa()
  if (project.serve.proxies.length > 0) {
    server.use(webProxy({
      proxies: project.serve.proxies
    }))
  }
  await useRoutes(server, [
    createTracker(project, options)
  ])
  server.use(koaConditional())
  server.use(koaETag())
  server.use(koaCompress())
  server.use(koaBodyParser())
  server.use(webError({
    project,
    reader: (ctx, page) => {
      return koaSend(ctx, page.path, {
        root: project.webDist,
        extensions: ['html']
      })
    }
  }))
  server.use(webStatic({
    dist: project.astDist,
    prefix: project.publicPath,
    extensions: ['html','json']
  }))
  server.use(webStatic({
    dist: project.webDist,
    index: project.index?.id,
    prefix: project.publicPath,
    extensions: ['html','json']
  }))
  return server
}
