import ora from 'ora'
import fse from 'fs-extra'
import { Context } from 'koa'
import { get, isFunction, isArray } from 'lodash'
import { Client as ElasticSearch } from '@elastic/elasticsearch'
import { ReactCSR } from 'pro/react-csr'
import { cmdPath } from 'utl/path'
import { RouteConfig } from '../common/server'

interface TrackOptions {
  /**
   * 服务器密码
   */
  password: string
}

/**
 * the symbol what is tracking primary info array join to string
 */
const TRACK_JOIN_SYMBOL = '!'

/**
 * the symbol what is reference info array join to string
 */
const REFERENCE_JOIN_SYMBOL = '~'

/**
 * the symbol what is performance array join to string
 */
const PERF_JOIN_SYMBOL = '~'

/**
 * 创建用于跟踪功能的路由
 */
export async function createTracker(project: ReactCSR, options: TrackOptions): Promise<RouteConfig[] | undefined> {
  const { trackPath } = project
  if (!trackPath) {
    return
  }
  const es = createElasticSearch(project)
  if (!es) {
    return
  }
  const tip = ora('server is connecting elasticsearch').start()
  const connected = await new Promise<boolean>(resolve => {
    es.ping(undefined, { requestTimeout: 3000 })
      .then(({ statusCode, body }) => {
        resolve(statusCode === 200 && body === true)
      })
      .catch(() => resolve(false))
  })
  if (!connected) {
    tip.info('server cannot connect elasticsearch, tracking service is closed')
    return
  }
  tip.succeed('server connected elasticsearch successfully')
  return [
    // get trackPath 是提交数据，因为采用的是image提交
    ['get', project.trackPath, (ctx: Context) => saveTrackData(es, ctx, project)],
    // post trackPath 是一个对外的聚合接口，可以通过它实现对数据库的各种操作
    // 但若要使用它，需要提供服务器的密码，在启动服务器时，密码会打印在控制台中
    // 可通过命令选项 -p 指定密码，否则服务器每次启动都将使用随机密码
    ['post', project.trackPath, (ctx: Context) => operateTrackData(es, ctx, options)]
  ]
}

/**
 * 获取es实例
 */
function createElasticSearch(project: ReactCSR): ElasticSearch | undefined {
  if (project.trackOptions) {
    return new ElasticSearch(project.trackOptions)
  } else {
    const esDockerComposePath = cmdPath('buf/est/docker-compose.yml')
    if (fse.existsSync(esDockerComposePath)) {
      const esdc = fse.readFileSync(esDockerComposePath).toString('utf8')
      const matched = esdc.match(/ELASTIC_PASSWORD=([0-9a-zA-Z\-\_]+)/)
      if (matched && matched[1]) {
        return new ElasticSearch({
          node: `http://elastic:${matched[1]}@127.0.0.1:9200`,
        })
      }
    }
  }
  return
}

/**
 * 保存从页面获取到的打点数据至es
 * https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html
 */
function saveTrackData(es: ElasticSearch, ctx: Context, project: ReactCSR) {
  ctx.status = 204
  const query = ctx.query as Record<string, string|undefined>
  const tl = (query.t || '').split(TRACK_JOIN_SYMBOL)
  if (tl.length < 7) {
    return
  }
  /**
   * 页面公共数据
   */
  const index = tl[0]
  const body: Record<string, any> = {
    time: new Date(),
    ip: ctx.request.ip || '',
    ua: ctx.header['user-agent'] || '',
    url: ctx.header.referer || '',
    project: project.id,
    sn: tl[1] || '',
    view: tl[2] || '',
    page: tl[3] || '',
    path: tl[4] || '',
    search: tl[5] || '',
    hash: tl[6] || '',
  }
  if (tl[7]) {
    const rl = tl[7].split(REFERENCE_JOIN_SYMBOL)
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
  /**
   * 类型为pv时，解析出性能数据
   */
  if (index === 'pv') {
    const pl = (query.p || '').split(PERF_JOIN_SYMBOL)
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
  /**
   * 类型为err时，保存错误信息
   */
  else if (index === 'err') {
    if (!query.e) {
      return
    }
    body.err = query.e
  }
  /**
   * 类型为inf时，保存普通信息
   */
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
 */
async function operateTrackData(es: ElasticSearch, ctx: Context, options: TrackOptions) {
  const payload = ctx.request.body || {}
  if (payload.password !== options.password) {
    return
  }
  const method = get(es, payload.method)
  if (!isFunction(method) || !isArray(payload.params)) {
    return
  }
  ctx.body = await method(...payload.params)
}
