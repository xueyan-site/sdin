#!/usr/bin/env node

import http from 'http'
import { Command } from 'commander'
import { printTask } from '../utils/console'
import { green, red } from 'chalk'
import { URL } from 'url'

const cmd = new Command()

cmd
  .description('redirect http to https')
  .arguments('[path]')
  .option('-p, --port <number>', 'server port')
  .action(action)
  .parse(process.argv)

interface CmdOpts {
  port?: string
}

async function action(path?: string) {
  const opts = cmd.opts<CmdOpts>()
  const port = opts.port ? Number(opts.port) : 80
  const server = http.createServer((req, res) => {
    const url = new URL(req.url || '', `https://${req.headers.host}`)
    if (!path || url.pathname.startsWith(path)) {
      res.writeHead(301, { Location: url.href })
      res.end()
    }
  })
  const origin = `http://127.0.0.1:${port}`
  await printTask({
    failed: `http to https service open ${red('failed')}`,
    success: `http to https server listening on ${green(origin)}`,
    task: () => new Promise<void>(res => {
      server.listen(port, () => res())
    })
  })
}
