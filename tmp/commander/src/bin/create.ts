#!/usr/bin/env node

import { Command } from 'commander'
import { cwdPath } from 'utl/path'
import { printExitError, printInfo } from 'utl/print'
import create from 'scr/create'

process.on('unhandledRejection', (reason: any) => printExitError(reason))
process.on('uncaughtException', err => printExitError(err, 1))

printInfo(`welcome to use <%= name %>`)
printInfo('project creation process is ready')
const program = new Command()

program
  .description('create project')
  .arguments('[path]')
  .action(action)
  .parse(process.argv)

async function action(path: string) {
  await create(cwdPath(path))
}
