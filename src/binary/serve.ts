#!/usr/bin/env node

import { Command } from 'commander'
import { logErrorAndExit } from 'utils/print'
import { cwdPath } from 'utils/path'
import { readProjectMeta } from 'base/project'
import ReactApplication from 'projects/react-application'
import { ReactApplicationServer } from 'scripts/react-application'

process.on('unhandledRejection', (reason: any) => logErrorAndExit(reason))
process.on('uncaughtException', err => logErrorAndExit(err, 1))

const program = new Command()

program
  .description('open project server')
  .arguments('[path]')
  .action(action)
  .parse(process.argv)

async function action(path?: string) {
  const projectPath = cwdPath(path || '')
  const meta = readProjectMeta(projectPath)
  if (meta.type === 'react-application') {
    const builder = new ReactApplicationServer({
      project: new ReactApplication(meta)
    })
    await builder.open()
  } else {
    throw new Error('please indicates the type of project in config file')
  }
}
