import React, { lazy } from 'react'
import { HashRouter } from 'react-router-dom'
import Pages, { PageSources } from 'xueyan-react-pages'

const Readme = lazy(() => import('./readme'))

const sources: PageSources = {
  en: {
    header: '<%= name %>',
    groupList: [
      {
        name: 'document',
        nodeList: [
          {
            path: '/api',
            name: 'interface',
            component: lazy(() => import('./en/api'))
          },
          {
            path: '/use',
            name: 'usage',
            component: lazy(() => import('./en/use'))
          }
        ]
      }
    ]
  },
  zh: {
    header: '<%= name %>',
    groupList: [
      {
        name: '文档',
        nodeList: [
          {
            path: '/api',
            name: '接口',
            component: lazy(() => import('./zh/api'))
          },
          {
            path: '/use',
            name: '用法',
            component: lazy(() => import('./zh/use'))
          }
        ]
      }
    ]
  }
}

export default function Index() {
  return (
    <HashRouter>
      <Pages readme={Readme} sources={sources} />
    </HashRouter>
  )
}
