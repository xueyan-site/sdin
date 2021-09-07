#!/usr/bin/env node

import chalk from 'chalk'
import { Command } from 'commander'
import { printExitError, printInfo } from 'utl/print'
import { cwdPath } from 'utl/path'
import { readProjectMeta } from 'pro/project'
import ReactCSR, { REACT_CSR_TYPE } from 'pro/react-csr'
import { ReactCSRServer } from 'scr/react-csr'
import type Server from 'exe/server'

process.on('unhandledRejection', (reason: any) => printExitError(reason))
process.on('uncaughtException', err => printExitError(err, undefined, 1))

printInfo(`welcome to use ${chalk.blue('xueyan-typescript-cli')}`)
const program = new Command()

program
  .description('open project server')
  .arguments('[path]')
  .option('-p, --password', 'server password')
  .action(action)
  .parse(process.argv)

async function action(path?: string) {
  const options = program.opts()
  const projectPath = cwdPath(path || '')
  const meta = readProjectMeta(projectPath)
  let server: Server<any> | undefined
  if (meta.type === REACT_CSR_TYPE) {
    server = new ReactCSRServer({
      project: new ReactCSR(meta),
      password: options.password
    })
  }
  if (server) {
    await server.open()
  } else {
    printExitError('sorry, this command is not available for the current project')
  }
}
