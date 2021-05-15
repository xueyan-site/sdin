#!/usr/bin/env node

import { Command } from 'commander'
import { logErrorAndExit } from 'utils/print'
import { cwdPath } from 'utils/path'
import { readProjectMeta } from 'projects/project'
import NodeApplication, { NODE_APPLICATION_TYPE } from 'projects/node-application'
import NodePackage, { NODE_PACKAGE_TYPE } from 'projects/package'
import ReactApplication, { REACT_APPLICATION_TYPE } from 'projects/react-application'
import ReactPackage, { REACT_PACKAGE_TYPE } from 'projects/react-package'
import { NodeApplicationBuilder } from 'scripts/node-application'
import { NodePackageBuilder } from 'scripts/node-package'
import { ReactApplicationBuilder } from 'scripts/react-application'
import { ReactPackageBuilder } from 'scripts/react-package'

process.on('unhandledRejection', (reason: any) => logErrorAndExit(reason))
process.on('uncaughtException', err => logErrorAndExit(err, 1))

const program = new Command()

program
  .description('build project to production line')
  .arguments('[path]')
  .option('-w, --watch', 'watch file change')
  .action(action)
  .parse(process.argv)

async function action(path?: string) {
  const meta = readProjectMeta(cwdPath(path || ''))
  if (meta.type === 'node-application') {
    const builder = new NodeApplicationBuilder({
      project: new NodeApplication(meta),
      watch: program.watch
    })
    await builder.open()
  } else if (meta.type === 'node-package') {
    const builder = new NodePackageBuilder({
      project: new NodePackage(meta),
      watch: program.watch
    })
    await builder.open()
  } else if (meta.type === 'react-application') {
    const builder = new ReactApplicationBuilder({
      project: new ReactApplication(meta)
    })
    await builder.open()
  } else if (meta.type === 'react-package') {
    const builder = new ReactPackageBuilder({
      project: new ReactPackage(meta),
      watch: program.watch
    })
    await builder.open()
  } else {
    throw new Error('please indicates the type of project in config file')
  }
}
