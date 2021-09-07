import { execSync, exec } from 'child_process'
import type { ExecSyncOptions } from 'child_process'

/**
 * 同步执行命令，并将信息显示在父进程中
 * @param {String} command 命令
 */
export function executeSync(command: string, options?: ExecSyncOptions) {
  return execSync(command, Object.assign({
    stdio: 'inherit'
  }, options))
}

/**
 * 同步执行命令，并将信息显示在父进程中
 * @param {String} command 命令
 */
export function execute(command: string, options?: ExecSyncOptions) {
  return exec(command, Object.assign({
    stdio: 'inherit'
  }, options))
}

/**
 * 流或者空
 */
export type StreamOrNull = NodeJS.ReadWriteStream | null | undefined | false | ''

/**
 * 流转换函数
 */
export type StreamTransfer = (prev: any) => NodeJS.ReadWriteStream | StreamOrNull

/**
 * 原始流素材
 */
export type StreamSource = StreamTransfer | StreamOrNull

/**
 * 对多个stream进行pipe链接，并加入错误处理
 * @param values 
 * @param cb 
 * @returns 
 */
export function pipeline(...sources: StreamSource[]) {
  return new Promise<void>((resolve, reject) => {
    let curr: any = undefined
    let prev: any = undefined
    for (let i = 0; i < sources.length; i++) {
      curr = sources[i]
      if (typeof curr === 'function') {
        prev = curr(prev)
      } else if (curr && curr.write) {
        curr.on('error', reject)
        if (prev && prev.pipe) {
          prev = prev.pipe(curr)
        } else {
          prev = curr
        }
      }
    }
    if (!curr) {
      throw Error('there is no one stream, cannot concat sources to pipeline')
    }
    if (resolve) {
      curr.on('end', resolve)
    }
    return curr
  })
}
