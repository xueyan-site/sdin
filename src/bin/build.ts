#!/usr/bin/env node

import chalk from 'chalk'
import { Command } from 'commander'
import { printExitError, printInfo } from 'utl/print'
import { cwdPath } from 'utl/path'
import { readProjectMeta } from 'pro/project'
import Package, { PACKAGE_TYPE } from 'pro/package'
import ReactCSR, { REACT_CSR_TYPE } from 'pro/react-csr'
import { PackageBuilder } from 'scr/package'
import { ReactCSRBuilder } from 'scr/react-csr'
import type Builder from 'exe/builder'

process.on('unhandledRejection', (reason: any) => printExitError(reason))
process.on('uncaughtException', err => printExitError(err, 1))

printInfo(`welcome to use ${chalk.blue('xueyan-typescript-cli')}`)
const program = new Command()

program
  .description('build project to production line')
  .arguments('[path]')
  .action(action)
  .parse(process.argv)

async function action(path?: string) {
  const projectPath = cwdPath(path || '')
  const meta = readProjectMeta(projectPath)
  let builder: Builder<any> | undefined
  if (meta.type === PACKAGE_TYPE) {
    builder = new PackageBuilder({
      project: new Package(meta)
    })
  } else if (meta.type === REACT_CSR_TYPE) {
    builder = new ReactCSRBuilder({
      project: new ReactCSR(meta)
    })
  }
  if (builder) {
    await builder.open()
  } else {
    throw Error('please indicates the type of project in config file')
  }
}
