#!/usr/bin/env node

import { Command } from 'commander'
import { printExitError } from 'utl/print'
import { cwdPath } from 'utl/path'
import { readProjectMeta } from 'pro/project'
import ReactCSR, { REACT_CSR_TYPE } from 'pro/react-csr'
import { ReactCSRStarter } from 'scr/react-csr'

process.on('unhandledRejection', (reason: any) => printExitError(reason))
process.on('uncaughtException', err => printExitError(err, 1))

const program = new Command()

program
  .description('develop or debug project on browser')
  .arguments('[path]')
  .action(action)
  .parse(process.argv)

async function action(path?: string) {
  const projectPath = cwdPath(path || '')
  const meta = readProjectMeta(projectPath)
  if (meta.type === REACT_CSR_TYPE) {
    const builder = new ReactCSRStarter({
      project: new ReactCSR(meta)
    })
    await builder.open()
  } else {
    throw Error('please indicates the type of project in config file')
  }
}
