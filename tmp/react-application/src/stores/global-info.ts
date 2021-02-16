/**
 * 全局信息
 * global information
 */

import Store, { createProvider, useData, useStore } from 'xueyan-react-store'
import { GlobalInfo } from 'types'

const GLOBAL_INFO_STORE_TYPE = 'global-info'

export const GlobalInfoProvider = createProvider((props: Partial<GlobalInfo>) => {
  return new Store<GlobalInfo>(GLOBAL_INFO_STORE_TYPE, {
    username: props.username || ''
  })
})

export function useGlobalInfo() {
  return useData<GlobalInfo>(GLOBAL_INFO_STORE_TYPE)
}

export function useGlobalInfoStore() {
  return useStore<Store<GlobalInfo>>(GLOBAL_INFO_STORE_TYPE)
}
