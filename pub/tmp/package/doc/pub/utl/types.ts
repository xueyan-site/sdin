export {};

declare global {
  /** package.json.name */
  const XT_ID: string
  /** project.js.type */
  const XT_TYPE: string
  /** project runtime env, web or node */
  const XT_ENV: 'web' | 'node'
  /** project is in dev mode or not */
  const XT_DEV: boolean
  /** project name, usually package.json.name, you can customize in project.js */
  const XT_NAME: string
  /** package.json.author, e.g. author <xxx@xxx.xxx> */
  const XT_AUTHOR: string
  /** project author, e.g. author */
  const XT_AUTHOR_NAME: string
  /** project author, e.g. xxx@xxx.xxx */
  const XT_AUTHOR_EMAIL: string
  /** package.json.version */
  const XT_VERSION: string
  /** project fold path in file system */
  const XT_ROOT: string
  /** url public path (start and end with \/), please see project.js.path */
  const XT_PATH: string
  /** project track path, (value "" after closing the hit) */
  const XT_TRACK_PATH: string
}
