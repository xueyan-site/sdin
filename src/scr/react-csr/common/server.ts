import koaMount from 'koa-mount'
import koaStatic from 'koa-static'

/**
 * 网站静态资源
 */
export function webStatic(publicPath: string, distPath: string) {
  if (publicPath) {
    return koaMount(publicPath, koaStatic(distPath))
  } else {
    return koaStatic(distPath)
  }
}
