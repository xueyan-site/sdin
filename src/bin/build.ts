#!/usr/bin/env node

import { Command } from 'commander'
import { resolve } from 'path'
import { CWD_PATH } from '../utils/path'
import { printExit } from '../utils/console'
import { getJsonSync } from '../utils/read'
import { buildPackage } from '../build-package'
import { buildReactCSR } from '../build-react-csr'

const cmd = new Command()

cmd
  .description('build project to production line')
  .arguments('[path]')
  .action(action)
  .parse(process.argv)

async function action(path?: string) {
  const root = resolve(CWD_PATH, path || '')
  const cfg = getJsonSync(resolve(root, 'project.js'), true)
  if (cfg.type === 'package') {
    await buildPackage({ root })
  } else if (cfg.type === 'react-csr') {
    await buildReactCSR({ root })
  } else {
    printExit(`sorry, there are no items of type ${cfg.type}`)
  }
}
