import { printSuccess } from 'utl/print'

/**
 * main program  
 */
export default async function main(path: string) {
  await new Promise<void>(resolve => {
    setTimeout(() => {
      printSuccess('new application path: ' + path)
      resolve()
    }, 100)
  })
}
