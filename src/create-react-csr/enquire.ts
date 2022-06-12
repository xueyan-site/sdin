import { resolve } from 'path'
import { prompt } from 'enquirer'
import validator from 'validator'
import { CWD_PATH, CMD_PATH } from '../utils/path'
import { CreateReactCSRProps } from './create'
import { getGitGlobalConfigSync } from '../utils/git'

export async function enquireReactCSR(
  target?: string, // 预设的项目生成目录
  name?: string
): Promise<CreateReactCSRProps> {
  const git = getGitGlobalConfigSync()
  const data = await prompt<{
    name: string
    target: string
    authorName: string
    authorEmail: string
  }>([
    {
      type: 'input',
      name: 'name',
      message: 'what is the name of your project',
      required: true,
      validate: str => /^[a-z@][a-z0-9\.\/\_\-]+$/.test(str),
      initial: name
    },
    {
      type: 'input',
      name: 'target',
      message: 'where do you want the project to be generated',
      required: true,
      initial: (data: any) => {
        const name = (data.state.answers.name || '').replace('/', '_')
        return target ? resolve(target, name) : resolve(CWD_PATH, name)
      }
    },
    {
      type: 'input',
      name: 'authorName',
      message: 'please tell me the name of author',
      required: true,
      initial: git.userName
    },
    {
      type: 'input',
      name: 'authorEmail',
      message: 'please tell me the email of author',
      required: true,
      initial: git.userEmail,
      validate: validator.isEmail
    }
  ])
  console.log()
  return {
    ...data,
    version: '1.0.0',
    author: `${data.authorName} <${data.authorEmail}>`,
    source: resolve(CMD_PATH, `pub/tmp/react-csr`),
  }
}
