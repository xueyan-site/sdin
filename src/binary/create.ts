#!/usr/bin/env node

import { Command } from 'commander'
import { prompt } from 'enquirer'
import validator from 'validator'
import { cwdPath } from 'utils/path'
import { logErrorAndExit } from 'utils/print'
import { readGitConfigSync } from 'utils/read'
import NodeApplication, { NODE_APPLICATION_TYPE } from 'projects/node-application'
import NodePackage, { NODE_PACKAGE_TYPE } from 'projects/node-package'
import ReactApplication, { REACT_APPLICATION_TYPE } from 'projects/react-application'
import ReactPackage, { REACT_PACKAGE_TYPE } from 'projects/react-package'
import { NodeApplicationCreater, NODE_APPLICATION_TEMPLATE_OPTIONS } from 'scripts/node-application'
import { NodePackageCreater, NODE_PACKAGE_TEMPLATE_OPTIONS } from 'scripts/node-package'
import { ReactApplicationCreater, REACT_APPLICATION_TEMPLATE_OPTIONS } from 'scripts/react-application'
import { ReactPackageCreater, REACT_PACKAGE_TEMPLATE_OPTIONS } from 'scripts/react-package'

process.on('unhandledRejection', (reason: any) => logErrorAndExit(reason))
process.on('uncaughtException', err => logErrorAndExit(err, 1))

const program = new Command()

program
  .description('create project')
  .arguments('[path]')
  .action(action)
  .parse(process.argv)

async function action(path?: string) {
  /**
   * 确认类型
   */
  const { type } = await prompt<{ type: string }>([
    {
      type: 'select',
      name: 'type',
      initial: program.type,
      message: 'project type',
      required: true,
      choices: [
        {
          name: 'react-application',
          message: 'react application'
        },
        {
          name: 'react-package',
          message: 'react package'
        },
        {
          name: 'node-package',
          message: 'node package'
        },
        {
          name: 'node-application',
          message: 'node application'
        }
      ]
    }
  ])
  /**
   * 确认需要使用的模版
   */
  const templateList = type === NODE_APPLICATION_TYPE
    ? NODE_APPLICATION_TEMPLATE_OPTIONS
    : type === NODE_PACKAGE_TYPE
    ? NODE_PACKAGE_TEMPLATE_OPTIONS
    : type === REACT_APPLICATION_TYPE
    ? REACT_APPLICATION_TEMPLATE_OPTIONS
    : type === REACT_PACKAGE_TYPE
    ? REACT_PACKAGE_TEMPLATE_OPTIONS
    : []
  let template: string = templateList.length === 1
    ? templateList[0].value
    : ''
  if (!template) {
    template = (await prompt<{ template: string }>([
      {
        type: 'select',
        name: 'type',
        initial: program.type,
        message: 'project type',
        required: true,
        choices: templateList.map(i => ({
          name: i.value,
          message: i.label
        }))
      }
    ])).template
  }
  /**
   * 设置其余值
   */
  const git = readGitConfigSync()
  const answers = await prompt<{
    name: string
    path: string
    author: string
    email: string
  }>([
    {
      type: 'input',
      name: 'name',
      message: 'package name',
      required: true,
      validate: str => /^[a-z@][a-z0-9\.\/\_\-]+$/.test(str)
    },
    {
      type: 'input',
      name: 'path',
      message: 'project path',
      required: true,
      initial: (data: any) => {
        const answers = data.state.answers
        const packageName = answers.name || ''
        return cwdPath(path || '', packageName.replace('/', '_'))
      }
    },
    {
      type: 'input',
      name: 'author',
      message: 'package author name',
      required: true,
      initial: git.user.name
    },
    {
      type: 'input',
      name: 'email',
      message: 'package author email',
      required: true,
      initial: git.user.email,
      validate: validator.isEmail
    }
  ])
  /**
   * 生成项目模版
   */
  const meta = {
    type,
    path: answers.path,
    package: {
      name: answers.name,
      version: '1.0.0',
      author: `${answers.author} <${answers.email}>`
    }
  }
  if (meta.type === 'node-application') {
    const creater = new NodeApplicationCreater({
      project: new NodeApplication(meta),
      template
    })
    await creater.open()
  } else if (meta.type === 'node-package') {
    const creater = new NodePackageCreater({
      project: new NodePackage(meta),
      template
    })
    await creater.open()
  } else if (meta.type === 'react-application') {
    const creater = new ReactApplicationCreater({
      project: new ReactApplication(meta),
      template
    })
    await creater.open()
  } else if (meta.type === 'react-package') {
    const creater = new ReactPackageCreater({
      project: new ReactPackage(meta),
      template
    })
    await creater.open()
  } else {
    throw new Error('please indicates the type of project in config file')
  }
}
