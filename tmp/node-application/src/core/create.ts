import { logSuccess } from '../utils/print'

/**
 * main program
 */
export default async function main(path: string) {
  await new Promise<void>(resolve => {
    setTimeout(() => {
      logSuccess('The node application path: ' + path)
      resolve()
    }, 100)
  })
}
