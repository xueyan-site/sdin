import ora from 'ora'
import { resolve } from 'path'
import { Context, Middleware } from 'koa'
import KoaRouter from 'koa-router'
import koaCompose from 'koa-compose'
import { get, isFunction, isArray } from 'lodash'
import { existsSync, readFileSync } from 'fs-extra'
import { Client as ElasticSearch } from '@elastic/elasticsearch'
import { CMD_PATH } from '../utils/path'
import type { ClientOptions as ESClientOptions } from '@elastic/elasticsearch'
import type { ReactCSRProjectConfig } from 'src/react-csr'

export async function createTracker(
  cfgs: ReactCSRProjectConfig[]
): Promise<Middleware<any, any> | undefined> {
  const cs = cfgs.filter(i => i.trackPath)
  if (cs.length < 1) {
    return
  }
  const opts: ESClientOptions = {}
  cs.forEach(i => Object.assign(opts, i.trackOptions))
  const es = await connectElasticSearch(opts)
  if (!es) {
    return
  }
  const router = new KoaRouter()
  cs.forEach(cfg => {
    router.get(cfg.trackPath, ctx => saveTrackData(es, ctx, cfg.id))
    router.post(cfg.trackPath, ctx => operateTrackData(es, ctx))
  })
  return koaCompose([
    router.routes(),
    router.allowedMethods()
  ])
}

/**
 * 连接 ES
 */
async function connectElasticSearch(opts: ESClientOptions): Promise<ElasticSearch | undefined> {
  let es: ElasticSearch | undefined
  if (opts) {
    es = new ElasticSearch(opts)
  } else {
    const esDockerComposePath = resolve(CMD_PATH, 'buf/est/docker-compose.yml')
    if (existsSync(esDockerComposePath)) {
      const esdc = readFileSync(esDockerComposePath).toString('utf8')
      const matched = esdc.match(/ELASTIC_PASSWORD=([0-9a-zA-Z\-\_]+)/)
      if (matched && matched[1]) {
        es = new ElasticSearch({
          node: `http://elastic:${matched[1]}@127.0.0.1:9200`,
        })
      }
    }
  }
  if (es) {
    const esc = es
    const tip = ora('server is connecting elasticsearch').start()
    const connected = await new Promise<boolean>(resolve => {
      esc.ping(undefined, { requestTimeout: 3000 })
        .then(res => resolve(res.statusCode === 200 && res.body === true))
        .catch(() => resolve(false))
    })
    if (!connected) {
      tip.info('server cannot connect elasticsearch, tracking service is closed')
      return undefined
    }
    tip.succeed('server connected elasticsearch successfully')
  }
  return es
}

/**
 * 保存打点数据至 ES
 * https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html
 */
function saveTrackData(es: ElasticSearch, ctx: Context, id: string) {
  ctx.status = 204
  const query = ctx.query as Record<string, string|undefined>
  const tl = (query.t || '').split('!')
  if (tl.length < 7) {
    return
  }
  // 页面公共数据
  const index = tl[0]
  const body: Record<string, any> = {
    time: new Date(),
    ip: ctx.request.ip || '',
    ua: ctx.header['user-agent'] || '',
    url: ctx.header.referer || '',
    project: id,
    sn: tl[1] || '',
    view: tl[2] || '',
    page: tl[3] || '',
    path: tl[4] || '',
    search: tl[5] || '',
    hash: tl[6] || '',
  }
  if (tl[7]) {
    const rl = tl[7].split('~')
    if (rl.length >= 1) {
      body.refer = {
        view: rl[0] || '',
        sn: rl[1] || '',
        sid: rl[2] || '',
        sidx: Number(rl[3] || 0)
      }
    }
  }
  if (query.d) {
    const data = JSON.parse(query.d)
    if (Object.keys(data).length > 0) {
      body.data = data
    }
  }
  // 类型为pv时，解析出性能数据
  if (index === 'pv') {
    const pl = (query.p || '').split('~')
    if (pl.length < 10) {
      return
    }
    body.perf = {
      t: pl[0] || '',
      to: Number(pl[1] || 0),
      at: Number(pl[2] || 0),
      // --------------------
      st: Number(pl[3] || 0),
      dt: Number(pl[4] || 0),
      // --------------------
      ues: Number(pl[5] || 0),
      uee: Number(pl[6] || 0),
      // --------------------
      rc: Number(pl[7] || 0),
      rs: Number(pl[8] || 0),
      re: Number(pl[9] || 0),
      // --------------------
      fs: Number(pl[10] || 0),
      dls: Number(pl[11] || 0),
      dle: Number(pl[12] || 0),
      // --------------------
      cs: Number(pl[13] || 0),
      scs: Number(pl[14] || 0),
      ce: Number(pl[15] || 0),
      // --------------------
      reqs: Number(pl[16] || 0),
      ress: Number(pl[17] || 0),
      rese: Number(pl[18] || 0),
      // --------------------
      dic: Number(pl[19] || 0),
      dcles: Number(pl[20] || 0),
      dclee: Number(pl[21] || 0),
      dc: Number(pl[22] || 0),
      // --------------------
      les: Number(pl[23] || 0),
      lee: Number(pl[24] || 0),
      ws: Number(pl[25] || 0),
      ts: Number(pl[26] || 0),
      ebs: Number(pl[27] || 0),
      dbs: Number(pl[28] || 0),
      nhp: pl[29] || '',
      // --------------------
      ujhs: Number(pl[30] || 0),
      tjhs: Number(pl[31] || 0),
      jhsl: Number(pl[32] || 0),
    }
  }
  // 类型为err时，保存错误信息
  else if (index === 'err') {
    if (!query.e) {
      return
    }
    body.err = query.e
  }
  // 类型为inf时，保存普通信息
  else if (index === 'inf') {
    if (!query.i) {
      return
    }
    body.info = query.i
  }
  return es.index({ index, body })
}

/**
 * 操纵打点数据
 * https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html
 * request body { method: '', params: { ... } }
 */
async function operateTrackData(es: ElasticSearch, ctx: Context) {
  const payload = ctx.request.body || {}
  const method = get(es, payload.method)
  if (!isFunction(method) || !isArray(payload.params)) {
    return
  }
  ctx.body = await method(...payload.params)
}
