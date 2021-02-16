/**
 * 应用的配置
 * application config
 */

import Store, { createProvider, useData, useStore } from 'xueyan-react-store'
import { AppConfig } from 'types'

const APP_CONFIG_STORE_TYPE = 'app-config'

export const AppConfigProvider = createProvider((props: Partial<AppConfig>) => {
  return new Store<AppConfig>(APP_CONFIG_STORE_TYPE, {
    domain: props.domain || ''
  })
})

export function useAppConfig() {
  return useData<AppConfig>(APP_CONFIG_STORE_TYPE)
}

export function useAppConfigStore() {
  return useStore<Store<AppConfig>>(APP_CONFIG_STORE_TYPE)
}
