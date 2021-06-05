import express, { Express, Router } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import CompressionMiddleware from 'compression'
import HistoryApiMiddleware from 'connect-history-api-fallback'
import Server, { ServerProps } from 'executors/server'
import ReactCSR from 'projects/react-csr'
import { printInfo } from 'utils/print'

/**
 * react应用创建器实例化参数
 */
export interface ReactCSRServerProps extends ServerProps<ReactCSR> {}

/**
 * react应用创建器
 */
export default class ReactCSRServer extends Server<ReactCSR> {
  /**
   * 服务器
   */
  readonly server: Express

  constructor(props: ReactCSRServerProps) {
    super(props)
    this.server = this.createServer()
  }

  async main() {
    const project = this.project
    const config = project.config
    return new Promise<void>(resolve => {
      this.on('close', () => {
        this.server.emit('close')
        resolve()
      })
      this.server.listen(config.servePort, () => {
        printInfo(`${project.name} listening on http://127.0.0.1:${config.servePort}!\n`)
      })
    })
  }

  /**
   * 创建服务器
   */
  private createServer() {
    const server = express()
    const project = this.project
    const config = project.config
    /**
     * 服务代理（优先进行接口代理）
     */
    const serveProxies = config.serveProxies
    if (serveProxies) {
      serveProxies.forEach(({ path, context, ...config }) => {
        if (path) {
          server.use(path, createProxyMiddleware(config))
        } else if (context) {
          server.use(createProxyMiddleware(context, config))
        } else {
          server.use(createProxyMiddleware(config))
        }
      })
    }
    /**
     * 开启压缩（使得开启了gzip的页面可以减少传输量）
     */
    server.use(CompressionMiddleware())
    /**
     * 静态配置
     */
    server.use(express.static(project.distPath))
    /**
     * 前端单页路由（当寻不到静态页面时）
     */
    const indexHtmlPath = project.withDistPath('index.html')
    server.use(HistoryApiMiddleware({
      index: indexHtmlPath
    }))
    const router = Router()
    router.get('*', (_req, res) => {
      res.sendFile(indexHtmlPath)
    })
    server.use(router)
    return server
  }
}
