import dayjs, { Dayjs } from 'dayjs'
import { isError } from 'lodash'

const TIME_FORMAT = 'MMDD.HH:mm:ss.SSS'

/**
 * 上次打印信息时的时间
 */
let __prevTime__: Dayjs | undefined

/**
 * 获取标签
 * @param msg 
 * @param callback 
 */
function getLabel(icon: string, msg: string) {
  const curr = dayjs()
  let diff = '      '
  if (__prevTime__) {
    diff = (Math.min(curr.diff(__prevTime__), 999999) + diff).slice(0,6)
  }
  __prevTime__ = curr
  return `${icon} ${curr.format(TIME_FORMAT)} ${diff} ${msg}`
}

/**
 * 打印错误信息
 * @param {String} msg 信息
 */
export const printError = (msg: string | Error, callback?: () => void) => {
  if (msg) {
    if (isError(msg) && msg.message) {
      console.log(getLabel('💥', msg.message))
      console.error(msg.stack)
    } else {
      console.log(getLabel('🐛', msg as any))
    }
    if (callback) {
      callback()
    }
  }
}

/**
 * 打印错误信息并退出
 * @param {String} msg 信息
 */
export const printExitError = (msg: string | Error, code?: number) => {
  printError(msg, () => process.exit(code))
}

/**
 * 打印普通信息
 * @param {String} msg 信息
 */
export const printInfo = (msg: string, callback?: () => void) => {
  if (msg) {
    console.log(getLabel('🍀', msg))
    if (callback) {
      callback()
    }
  }
}

/**
 * 打印错误信息并退出
 * @param {String} msg 信息
 */
export const printExitInfo = (msg: string, code?: number) => {
  printInfo(msg, () => process.exit(code))
}

/**
 * 打印加载信息
 * @param {String} msg 信息
 */
export const printLoading = (msg: string) => {
  if (msg) {
    console.log(getLabel('🚀', msg))
  }
}

/**
 * 打印警告信息
 * @param {String} msg 信息
 */
export const printWarning = (msg: string) => {
  if (msg) {
    console.log(getLabel('🔔', msg))
  }
}

/**
 * 打印成功信息
 * @param {String} msg 信息
 */
export const printSuccess = (msg: string) => {
  if (msg) {
    console.log(getLabel('🍺', msg))
  }
}
