export function create(path: string) {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      console.log('application path: ' + path)
      resolve()
    }, 100)
  })
}
