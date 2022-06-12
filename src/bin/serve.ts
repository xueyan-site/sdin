#!/usr/bin/env node

import { Command } from 'commander'
import { resolve } from 'path'
import { CWD_PATH } from '../utils/path'
import { printExit } from '../utils/console'
import { getJsonSync } from '../utils/read'
import { serveReactCSR } from '../serve-react-csr'

const cmd = new Command()

cmd
  .description('open project web server')
  .arguments('[path]')
  .option('-p, --port <number>', 'server port')
  .action(action)
  .parse(process.argv)

interface CmdOpts {
  port?: string
}

async function action(path?: string) {
  const opts = cmd.opts<CmdOpts>()
  const root = resolve(CWD_PATH, path || '')
  const cfg = getJsonSync(resolve(root, 'project.js'), true)
  const port = opts.port ? Number(opts.port) : undefined
  if (cfg.type === 'react-csr') {
    await serveReactCSR({ root, port })
  } else {
    printExit(`sorry, there are no items of type ${cfg.type}`)
  }
}
