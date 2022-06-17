#!/usr/bin/env node

import { Command } from 'commander'
import { resolve } from 'path'
import { CWD_PATH } from '../utils/path'
import { serves } from '../serves'

const cmd = new Command()

cmd
  .description('search projects and open web server')
  .arguments('[path]')
  .option('-l, --log', 'enable request logging')
  .option('-p, --port <number>', 'server port')
  .option('-k, --SSLKey <filePath>', 'SSL private key file path')
  .option('-c, --SSLCert <filePath>', 'SSL certification file path')
  .action(action)
  .parse(process.argv)

interface CmdOpts {
  log?: boolean
  port?: string
  SSLKey?: string
  SSLCert?: string
}

async function action(path?: string) {
  const opts = cmd.opts<CmdOpts>()
  const root = resolve(CWD_PATH, path || '')
  const log = opts.log
  const port = opts.port ? Number(opts.port) : undefined
  await serves({
    root,
    log,
    port,
    SSLKey: opts.SSLKey,
    SSLCert: opts.SSLCert
  })
}
