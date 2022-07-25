export {};

declare global {
  /** package.json.name */
  const P_ID: string
  /** project.js.type */
  const P_TYPE: string
  /** project runtime env, web or node */
  const P_ENV: 'web' | 'node'
  /** project is in dev mode or not */
  const P_DEV: boolean
  /** project name, usually package.json.name, you can customize in project.js */
  const P_NAME: string
  /** package.json.author, e.g. author <xxx@xxx.xxx> */
  const P_AUTHOR: string
  /** project author, e.g. author */
  const P_AUTHOR_NAME: string
  /** project author, e.g. xxx@xxx.xxx */
  const P_AUTHOR_EMAIL: string
  /** package.json.version */
  const P_VERSION: string
  /** project fold path in file system */
  const P_ROOT: string
  /** project public path (start and end with \/), please see project.js.path */
  const P_PUBLIC_PATH: string
  /** project assets path (start and end with \/) */
  const P_ASSETS_PATH: string
  /** project track path, (value "" after closing the hit) */
  const P_TRACK_PATH: string
}
