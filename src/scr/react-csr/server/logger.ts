// import ora from 'ora'
// import { Client } from '@elastic/elasticsearch'
// import type { Context, Next } from 'koa'

/**
 * 网站日志系统初始化配置项
 */
export interface WebLoggerOptions {
  // 资源目录
  dist: string
  // 访问路径前缀
  prefix?: string
}

/**
 * 网站日志系统
 */
export async function webLogger({}: WebLoggerOptions) {
  // const client = new Client({ node: 'http://localhost:9200' })
  // const tip = ora(``).start()
  // const isConnected = await new Promise<boolean>(resolve => {
  //   client.ping().then(status => {
  //     tip.succeed(``)
  //     resolve(status.statusCode === 1)
  //   })
  //   .catch(err => {
  //     tip.fail(``)
  //     console.error(err)
  //     resolve(false)
  //   })
  // })
  // return async (ctx: Context, next: Next) => {
  //   // try {
  //   //   await next()
  //   //   if (ctx.status >= 400) {
  //   //     throw new Error()
  //   //   }
  //   // } catch (error) {
  //   //   if (page && reader) {
  //   //     await reader(ctx, page, error)
  //   //   } else {
  //   //     ctx.set('content-type', 'text/html')
  //   //     ctx.body = error?.message
  //   //   }
  //   // }
  // }
}

