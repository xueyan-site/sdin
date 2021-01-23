import { execSync } from 'child_process'

/**
 * 同步执行命令，并将信息显示在父进程中
 * @param {String} command 命令
 */
export function executeSync(command: string) {
  return execSync(command, { stdio: 'inherit' })
}
