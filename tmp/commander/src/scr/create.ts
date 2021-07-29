import { printSuccess } from 'utl/print'

/**
 * main program  
 */
export default async function main(path: string) {
  await new Promise<void>(resolve => {
    setTimeout(() => {
      printSuccess('The node application path: ' + path)
      resolve()
    }, 100)
  })
}
