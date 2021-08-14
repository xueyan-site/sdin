import Koa from 'koa'
import koaConditional from 'koa-conditional-get'
import koaETag from 'koa-etag'
import koaCompress from 'koa-compress'
import koaSend from 'koa-send'
import { webStatic, webError, webProxy } from '../common/server'
import type ReactCSR from 'pro/react-csr'

/**
 * 创建服务器
 */
export function createServer(project: ReactCSR) {
  const server = new Koa()
  server.use(webProxy({
    proxies: project.serve.proxies
  }))
  server.use(koaConditional())
  server.use(koaETag())
  server.use(koaCompress())
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
