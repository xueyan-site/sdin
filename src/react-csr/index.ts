export { getReactCSRProjectConfigSync } from './project'
export { precheckReactCSR } from './check'
export { handleAssets } from './compile'
export { 
  getWebpackPageListConfig, 
  getWebpackDefinePlugin, 
  getWebpackResolve, 
  getWebpackResolveLoader, 
  getWebpackSplitChunks,
  getWebpackRules
} from './webpack'

export type { ReactCSRProjectUserConfig, ReactCSRProjectConfig } from './project'
export type { ReactCSRPageUserConfig, ReactCSRPageConfig, ReactCSRPageSkeleton } from './page'
