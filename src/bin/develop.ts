#!/usr/bin/env node

import { Command } from 'commander'
import { resolve } from 'path'
import { CWD_PATH } from '../utils/path'
import { printExit } from '../utils/console'
import { getJsonSync } from '../utils/read'
import { developPackage } from '../develop-package'
import { developReactCSR } from '../develop-react-csr'

const cmd = new Command()

cmd
  .description('develop or debug project')
  .arguments('[path]')
  .action(action)
  .parse(process.argv)

async function action(path?: string) {
  const root = resolve(CWD_PATH, path || '')
  const cfg = getJsonSync(resolve(root, 'project.js'), true)
  if (cfg.type === 'package') {
    await developPackage({ root })
  } else if (cfg.type === 'react-csr') {
    await developReactCSR({ root })
  } else {
    printExit(`sorry, there are no items of type ${cfg.type}`)
  }
}
