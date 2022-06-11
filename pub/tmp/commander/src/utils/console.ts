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
