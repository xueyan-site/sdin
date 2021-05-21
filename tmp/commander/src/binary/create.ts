#!/usr/bin/env node

import { Command } from 'commander'
import { logErrorAndExit } from 'utils/print'
import { cwdPath } from 'utils/path'
import create from 'scripts/create'

process.on('unhandledRejection', (reason: any) => logErrorAndExit(reason))
process.on('uncaughtException', err => logErrorAndExit(err, 1))

const program = new Command()

program
  .description('create project')
  .arguments('[path]')
  .action(action)
  .parse(process.argv)

async function action(path: string) {
  await create(cwdPath(path))
}
