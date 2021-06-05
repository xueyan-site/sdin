#!/usr/bin/env node

import { Command } from 'commander'
import { printExitError } from 'utils/print'
import { cwdPath } from 'utils/path'
import { readProjectMeta } from 'projects/project'
import ReactCSR, { REACT_CSR_TYPE } from 'projects/react-csr'
import { ReactCSRServer } from 'scripts/react-csr'

process.on('unhandledRejection', (reason: any) => printExitError(reason))
process.on('uncaughtException', err => printExitError(err, 1))

const program = new Command()

program
  .description('open project server')
  .arguments('[path]')
  .action(action)
  .parse(process.argv)

async function action(path?: string) {
  const projectPath = cwdPath(path || '')
  const meta = readProjectMeta(projectPath)
  if (meta.type === REACT_CSR_TYPE) {
    const builder = new ReactCSRServer({
      project: new ReactCSR(meta)
    })
    await builder.open()
  } else {
    throw Error('please indicates the type of project in config file')
  }
}
