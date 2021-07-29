#!/usr/bin/env node

import chalk from 'chalk'
import { Command } from 'commander'
import { printExitError, printInfo } from 'utl/print'
import { cwdPath } from 'utl/path'
import { readProjectMeta } from 'pro/project'
import Server from 'exe/server'
import ReactCSR, { REACT_CSR_TYPE } from 'pro/react-csr'
import { ReactCSRServer } from 'scr/react-csr'

process.env.XT_CMD = 'serve'
process.on('unhandledRejection', (reason: any) => printExitError(reason))
process.on('uncaughtException', err => printExitError(err, 1))

printInfo(`welcome to use ${chalk.blue('xueyan-typescript-cli')}`)
const program = new Command()

program
  .description('open project server')
  .arguments('[path]')
  .action(action)
  .parse(process.argv)

async function action(path?: string) {
  const projectPath = cwdPath(path || '')
  process.env.XT_PATH = projectPath
  const meta = readProjectMeta(projectPath)
  process.env.XT_TYPE = meta.type
  let server: Server<any> | undefined
  if (meta.type === REACT_CSR_TYPE) {
    server = new ReactCSRServer({
      project: new ReactCSR(meta)
    })
  }
  if (server) {
    await server.open()
  } else {
    throw Error('please indicates the type of project in config file')
  }
}
