/**
 * @package <%= name %>
 * @author <%= author %>
 * @description 文档入口 document entry
 */

import React, { lazy } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import Pages, { PageSources } from 'xueyan-react-pages'
import './index.scss'

const Readme = lazy(() => import('./readme'))

const sources: PageSources = {
  en: {
    header: '<%= name %>',
    groupList: [
      {
        name: 'api',
        nodeList: [
          {
            path: '/api-one',
            name: 'create',
            component: lazy(() => import('pages/en/api-one'))
          }
        ]
      },
      {
        name: 'use',
        nodeList: [
          {
            path: '/use-one',
            name: 'create an application',
            component: lazy(() => import('pages/en/use-one'))
          }
        ]
      }
    ]
  },
  zh: {
    header: '<%= name %>',
    groupList: [
      {
        name: '接口',
        nodeList: [
          {
            path: '/api-one',
            name: 'create',
            component: lazy(() => import('pages/zh/api-one'))
          }
        ]
      },
      {
        name: '示例',
        nodeList: [
          {
            path: '/use-one',
            name: '创建一个应用',
            component: lazy(() => import('pages/zh/use-one'))
          }
        ]
      }
    ]
  },
}

function App() {
  return (
    <BrowserRouter>
      <Pages readme={Readme} sources={sources} />
    </BrowserRouter>
  )
}

ReactDOM.render(
  <App/>,
  document.getElementById('app')
)
