#!/usr/bin/env node

import { Command } from 'commander'
import { printExitError } from 'utils/print'
import { cwdPath } from 'utils/path'
import { readProjectMeta } from 'projects/project'
import Package, { PACKAGE_TYPE } from 'projects/package'
import ReactCSR, { REACT_CSR_TYPE } from 'projects/react-csr'
import { PackageBuilder } from 'scripts/package'
import { ReactCSRBuilder } from 'scripts/react-csr'

process.on('unhandledRejection', (reason: any) => printExitError(reason))
process.on('uncaughtException', err => printExitError(err, 1))

const program = new Command()

program
  .description('build project to production line')
  .arguments('[path]')
  .option('-w, --watch', 'watch file change')
  .action(action)
  .parse(process.argv)

async function action(path?: string) {
  const meta = readProjectMeta(cwdPath(path || ''))
  if (meta.type === PACKAGE_TYPE) {
    const builder = new PackageBuilder({
      project: new Package(meta),
      watch: program.watch
    })
    await builder.open()
  } else if (meta.type === REACT_CSR_TYPE) {
    const builder = new ReactCSRBuilder({
      project: new ReactCSR(meta)
    })
    await builder.open()
  } else {
    throw Error('please indicates the type of project in config file')
  }
}
