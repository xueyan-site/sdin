#!/usr/bin/env node

import { Command } from 'commander'
import { resolve } from 'path'
import { CWD_PATH } from '../utils/path'
import { printExit } from '../utils/console'
import { getJsonSync } from '../utils/read'
import { serveReactCSR } from '../serve-react-csr'

const cmd = new Command()

cmd
  .description('develop or debug project')
  .arguments('[path]')
  .option('-p, --password', 'server password')
  .action(action)
  .parse(process.argv)

async function action(path?: string) {
  const opts = cmd.opts()
  const root = resolve(CWD_PATH, path || '')
  const cfg = getJsonSync(resolve(root, 'project.js'), true)
  if (cfg.type === 'react-csr') {
    await serveReactCSR({ root, password: opts.password })
  } else {
    printExit(`sorry, there are no items of type ${cfg.type}`)
  }
}
