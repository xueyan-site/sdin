import dayjs from 'dayjs'
import chalk from 'chalk'
import { isError } from 'lodash'
import type { Chalk } from 'chalk'

function getLabel(color: Chalk, msg: string) {
  return `${color(dayjs().format('HH:mm:ss.SSS'))} ${msg}`
}

export function printInfo(msg: string, callback?: () => void) {
  if (msg) {
    console.log(getLabel(chalk.blue, msg))
    if (callback) {
      callback()
    }
  }
}

export function printLoading(msg: string) {
  if (msg) {
    console.log(getLabel(chalk.magenta, msg))
  }
}

export function printSuccess(msg: string) {
  if (msg) {
    console.log(getLabel(chalk.green, msg))
  }
}

export function printWarning(msg: string) {
  if (msg) {
    console.log(getLabel(chalk.yellow, msg))
  }
}

export function printError(msg: string | Error, title?: string, callback?: () => void) {
  if (msg) {
    if (isError(msg)) {
      if (title) {
        console.log(getLabel(chalk.red, title))
      }
      if (msg.stack) {
        console.error(msg.stack)
      }
    } else {
      console.log(getLabel(chalk.red, msg as any))
    }
    if (callback) {
      callback()
    }
  }
}

export function printExitInfo(msg: string, code?: number) {
  printInfo(msg, () => process.exit(code))
}

export function printExitError(msg: string | Error, title?: string, code?: number) {
  printError(msg, title, () => process.exit(code))
}
