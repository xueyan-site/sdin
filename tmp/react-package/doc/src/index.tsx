/**
 * @package <%= package.name %>
 * @author <%= package.author %>
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
    header: '<%= package.name %>',
    groupList: [
      {
        name: 'api',
        nodeList: [
          {
            path: '/api-one',
            name: 'SwitchProps',
            component: lazy(() => import('pages/en/api-one'))
          }
        ]
      },
      {
        name: 'use',
        nodeList: [
          {
            path: '/use-one',
            name: 'normal',
            component: lazy(() => import('pages/en/use-one'))
          },
          {
            path: '/use-two',
            name: 'block element',
            component: lazy(() => import('pages/en/use-two'))
          }
        ]
      }
    ]
  },
  zh: {
    header: '<%= package.name %>',
    groupList: [
      {
        name: '接口',
        nodeList: [
          {
            path: '/api-one',
            name: 'SwitchProps',
            component: lazy(() => import('pages/zh/api-one'))
          }
        ]
      },
      {
        name: '示例',
        nodeList: [
          {
            path: '/use-one',
            name: '常规用法',
            component: lazy(() => import('pages/zh/use-one'))
          },
          {
            path: '/use-two',
            name: '显示为块级元素',
            component: lazy(() => import('pages/zh/use-two'))
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
