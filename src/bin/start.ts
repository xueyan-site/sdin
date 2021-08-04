#!/usr/bin/env node

import chalk from 'chalk'
import { Command } from 'commander'
import { printExitError, printInfo } from 'utl/print'
import { cwdPath } from 'utl/path'
import { readProjectMeta } from 'pro/project'
import Starter from 'exe/starter'
import Package, { PACKAGE_TYPE } from 'pro/package'
import ReactCSR, { REACT_CSR_TYPE } from 'pro/react-csr'
import { PackageStarter } from 'scr/package'
import { ReactCSRStarter } from 'scr/react-csr'

process.env.XT_CMD = 'start'
process.on('unhandledRejection', (reason: any) => printExitError(reason))
process.on('uncaughtException', err => printExitError(err, 1))

printInfo(`welcome to use ${chalk.blue('xueyan-typescript-cli')}`)
const program = new Command()

program
  .description('develop or debug project on browser')
  .arguments('[path]')
  .action(action)
  .parse(process.argv)

async function action(path?: string) {
  const projectPath = cwdPath(path || '')
  process.env.XT_PATH = projectPath
  const meta = readProjectMeta(projectPath)
  process.env.XT_TYPE = meta.type
  let starter: Starter<any> | undefined
  if (meta.type === PACKAGE_TYPE) {
    starter = new PackageStarter({
      project: new Package(meta)
    })
  } else if (meta.type === REACT_CSR_TYPE) {
    starter = new ReactCSRStarter({
      project: new ReactCSR(meta)
    })
  }
  if (starter) {
    await starter.open()
  } else {
    throw Error('please indicates the type of project in config file')
  }
}
