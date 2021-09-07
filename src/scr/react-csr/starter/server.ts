import Koa from 'koa'
import { webStatic, webError, webProxy } from '../common/server'
import { pageRouter, pageBuilder, pageReloader, readPage } from './page'
import type { Compiler } from 'webpack'
import type ReactCSR from 'pro/react-csr'

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
      return readPage(ctx, page, project, compiler)
    }
  }))
  server.use(webStatic({
    dist: project.astPub,
    prefix: project.publicPath,
    extensions: ['html','json']
  }))
  server.use(pageBuilder(project, compiler))
  server.use(pageReloader(compiler))
  server.use(pageRouter(project, compiler))
  return server
}
