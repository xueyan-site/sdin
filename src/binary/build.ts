#!/usr/bin/env node

import { Command } from 'commander'
import { logErrorAndExit } from 'utils/print'
import { cwdPath } from 'utils/path'
import { readProjectMeta } from 'base/project'
import NodeApplication from 'projects/node-application'
import NodePackage from 'projects/node-package'
import ReactApplication from 'projects/react-application'
import ReactPackage from 'projects/react-package'
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

async function action(path: string) {
  const projectPath = cwdPath(path)
  const meta = readProjectMeta(projectPath)
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
