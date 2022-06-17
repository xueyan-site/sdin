import Koa from 'koa'
import koaProxy from 'koa-proxy'
import koaLogger from 'koa-logger'
import e2k from 'express-to-koa'
import wdm from 'webpack-dev-middleware'
import whm from 'webpack-hot-middleware'
import { getStaticMdw, getPagesMdw } from './dist'
import type { Compiler } from 'webpack'
import type { ReactCSRProjectConfig } from '../react-csr'

export function createKoa({
  root,
  log,
  cfg,
  compiler
}: {
  root: string
  log?: boolean
  cfg: ReactCSRProjectConfig
  compiler: Compiler
}): Koa {
  const koa = new Koa()
  const develop = cfg.develop
  if (log) {
    koa.use(koaLogger())
  }
  develop.proxies.forEach(i => {
    koa.use(koaProxy(i))
  })
  koa.use(e2k(wdm(compiler, {
    stats: 'errors-warnings',
    publicPath: cfg.publicPath
  })))
  koa.use(e2k(whm(compiler)))
  koa.use(getStaticMdw(root, cfg))
  koa.use(getPagesMdw(root, cfg, compiler))
  return koa
}
