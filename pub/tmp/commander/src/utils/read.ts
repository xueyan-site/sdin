import { existsSync, readJSONSync } from 'fs-extra'
import { isPlainObject, isString } from 'lodash'
import { printExit } from './console'

export function getJsonSync<T = Record<string,any>>(
  value: any,
  strict?: boolean
): T {
  if (isPlainObject(value)) {
    return value
  }
  if (!isString(value)) {
    return {} as any
  }
  if (!existsSync(value)) {
    if (strict) {
      printExit('not exist: ' + value)
    } else {
      return {} as any
    }
  }
  let data: any
  if (/\.json$/.test(value)) {
    data = readJSONSync(value)
  } else if (/\.(js|mjs)$/.test(value)) {
    data = require(value)
  }
  if (strict && !isPlainObject(data)) {
    printExit('read failed: ' + value)
  }
  return data || {}
}
