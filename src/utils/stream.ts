import { printExit } from "./console"

export type StreamOrNull = NodeJS.ReadWriteStream | null | undefined | false | ''

export type StreamTransfer = (prev: any) => NodeJS.ReadWriteStream | StreamOrNull

export type StreamSource = StreamTransfer | StreamOrNull

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
      printExit('no streams, cannot concat sources to pipeline')
    }
    if (resolve) {
      curr.on('end', resolve)
    }
    return curr
  })
}
