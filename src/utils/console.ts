import ora from 'ora'
import { isFunction } from 'lodash'
import { blue, green, red } from 'chalk'
import { FunctionType, PromiseData } from './types'

process.on('unhandledRejection', (rsn: any) => {
  rsn && console.error(rsn)
  console.log()
  process.exit()
})

process.on('uncaughtException', err => {
  err && console.error(err)
  console.log()
  process.exit()
})

export function printExit(msg?: any, code: number = -1): any {
  process.exitCode = code
  throw msg
}

export function printTask<T extends () => any>({
  task,
  info,
  failed,
  success,
  color,
  noexit,
  noblank
}: {
  task: T
  info?: string
  failed?: string
  success?: string | ((res: PromiseData<FunctionType<T>>) => string)
  color?: boolean    // 显示颜色
  noexit?: boolean   // 在出现错误后，不退出
  noblank?: boolean  // 在完成后，不追加空行
}): FunctionType<T> {
  const tip = ora()
  if (info) {
    tip.start(color ? blue(info) : info)
  }
  const suc = (data: any) => {
    const label = typeof success === 'function' ? success(data) : success
    if (label) {
      tip.succeed(color ? green(label) : label)
    }
    if (!noblank) {
      console.log()
    }
    return data
  }
  const fail = (err: any) => {
    if (failed) {
      tip.fail(color ? red(failed) : failed)
    }
    if (noexit) {
      console.error(err)
    } else {
      printExit(err)
    }
    return undefined
  }
  try {
    const res = task()
    return isFunction(res && res.then)
      ? res.then(suc).catch(fail)
      : suc(res)
  } catch (err) {
    return fail(err) as any
  }
}
