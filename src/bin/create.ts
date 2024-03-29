#!/usr/bin/env node

import { blue } from 'chalk'
import { padEnd } from 'lodash'
import { Command } from 'commander'
import { prompt } from 'enquirer'
import { resolve } from 'path'
import { CWD_PATH } from '../utils/path'
import { printExit } from '../utils/console'
import { createPackage, enquirePackage } from '../create-package'
import { createReactCSR, enquireReactCSR } from '../create-react-csr'

const cmd = new Command()

cmd
  .description('create project')
  .arguments('[name]')
  .option('-p, --path <projectPath>', 'project path')
  .action(action)
  .parse(process.argv)

interface CmdOpts {
  path?: string
}

async function action(name?: string) {
  const opts = cmd.opts<CmdOpts>()
  const type = (await prompt<{ type: string }>([
    {
      type: 'select',
      name: 'type',
      message: 'what kind of project do you want to create',
      required: true,
      choices: [
        {
          name: 'package',
          message: blue(padEnd('package', 16)) + 'components or modules (node packages, web packages, react packages, command line tools, etc.)',
        },
        {
          name: 'react-csr',
          message: blue(padEnd('react-csr', 16)) + 'react application (client-side rendering)',
        }
      ]
    }
  ])).type
  const target = resolve(CWD_PATH, opts.path || '')
  if (type === 'package') {
    createPackage(await enquirePackage(target, name))
  } else if (type === 'react-csr') {
    createReactCSR(await enquireReactCSR(target, name))
  } else {
    printExit(`sorry, there are no items of type ${type}`)
  }
}
