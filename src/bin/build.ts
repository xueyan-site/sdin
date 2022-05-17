#!/usr/bin/env node

import { Command } from 'commander'
import { cwdPath, CMD } from 'utl/path'
import { readPackageInfoSync } from 'utl/read'
import { printExitError, printInfo } from 'utl/print'
import { readProjectMeta } from 'pro/project'
import { Package, PACKAGE_TYPE } from 'pro/package'
import { ReactCSR, REACT_CSR_TYPE } from 'pro/react-csr'
import { PackageBuilder } from 'scr/package'
import { ReactCSRBuilder } from 'scr/react-csr'
import type { Builder } from 'exe/builder'

process.on('unhandledRejection', (reason: any) => printExitError(reason))
process.on('uncaughtException', err => printExitError(err, undefined, 1))

const packageInfo = readPackageInfoSync(CMD)
printInfo(`${packageInfo.name} ${packageInfo.version}`)
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
    printExitError('sorry, this command is not available for the current project')
  }
}
