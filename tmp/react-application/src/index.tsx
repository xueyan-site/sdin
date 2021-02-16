/**
 * @package <%= package.name %>
 * @author <%= package.author %>
 * @description 应用程序入口 application entry
 */

import React, { lazy, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import Store from 'xueyan-react-store'
import { RouteInfo } from 'components/route-render'
import Container from 'components/container'
import { AppConfigProvider } from 'stores/app-config'
import { GlobalInfoProvider } from 'stores/global-info'
import { AppConfig, GlobalInfo } from 'types'
import './index.scss'

const routes: RouteInfo[] = [
  {
    path: '/page-one',
    name: 'page one',
    component: lazy(() => import('pages/page-one'))
  },
  {
    path: '/page-two',
    name: 'page two',
    component: lazy(() => import('pages/page-two'))
  }
]

function App() {
  const appConfigStoreRef = useRef<Store<AppConfig>>(null)
  const globalInfoStoreRef = useRef<Store<GlobalInfo>>(null)
  useEffect(() => {
    const appConfigStore = appConfigStoreRef.current
    const globalInfoStore = globalInfoStoreRef.current
    if (appConfigStore) {
      appConfigStore.setPartData({
        domain: 'www.xxx.com'
      })
    }
    if (globalInfoStore) {
      globalInfoStore.setPartData({
        username: 'user-name'
      })
    }
  }, [])
  return (
    <AppConfigProvider ref={appConfigStoreRef}>
      <GlobalInfoProvider ref={globalInfoStoreRef}>
        <BrowserRouter>
          <Container routes={routes} />
        </BrowserRouter>
      </GlobalInfoProvider>
    </AppConfigProvider>
  )
}

ReactDOM.render(
  <App/>,
  document.getElementById('app')
)
