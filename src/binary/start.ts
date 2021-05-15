#!/usr/bin/env node

import { Command } from 'commander'
import { logErrorAndExit } from 'utils/print'
import { cwdPath } from 'utils/path'
import { readProjectMeta } from 'projects/project'
import ReactCSR, { REACT_CSR_TYPE } from 'projects/react-csr'
import { ReactCSRStarter } from 'scripts/react-csr'

process.on('unhandledRejection', (reason: any) => logErrorAndExit(reason))
process.on('uncaughtException', err => logErrorAndExit(err, 1))

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
    throw new Error('please indicates the type of project in config file')
  }
}
