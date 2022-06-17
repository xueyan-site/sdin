import koaCompose from 'koa-compose'
import { getStaticMdw, getPagesMdw } from '../serve-react-csr/dist'
import type { AppInfo } from './apps'
import type { Middleware, Context, Next } from 'koa'

export function getAppDistMdw(apps: AppInfo[]): Middleware<any, any> {
  const mdwm: Record<string, Middleware|undefined> = {}
  apps.forEach(app => {
    if (!mdwm[app.cfg.publicPath]) {
      mdwm[app.cfg.publicPath] = koaCompose([
        getStaticMdw(app.root, app.cfg),
        getPagesMdw(app.root, app.cfg)
      ])
    }
  })
  return (ctx: Context, next: Next) => {
    const psp = ctx.path.split('/').filter(Boolean)
    const ps = ['/']
    psp.forEach(i => ps.push(i + '/'))
    let mdw: Middleware<any,any>|undefined
    let pa: string = ''
    for (let i = ps.length; i >= 1; i--) {
      pa = ps.slice(0, i).join('')
      mdw = mdwm[pa]
      if (mdw) {
        break
      }
    }
    if (mdw) {
      return mdw(ctx, next)
    }
  }
}
