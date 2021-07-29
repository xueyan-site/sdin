declare module '*.json' {
  const content: { [prop:string]: any }
  export default content
}

declare module '*.txt' {
  const content: string
  export default content
}
