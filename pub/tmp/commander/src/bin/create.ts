#!/usr/bin/env node

import { Command } from 'commander'
import { CWD_PATH } from '../utils/path'
import { resolve } from 'path'
import { create } from '../create'

const cmd = new Command()

cmd
  .description('create project')
  .arguments('[path]')
  .action(action)
  .parse(process.argv)

async function action(path?: string) {
  const target = resolve(CWD_PATH, path || '')
  await create(target)
}
