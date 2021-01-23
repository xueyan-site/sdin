/**
 * @package <%= package.name %>
 * @author <%= package.author %>
 * @description 应用程序入口 application entry
 */

import React, { lazy } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import Container, { PageGroup } from 'components/Container'
import './index.scss'

const PageOne = lazy(() => import('pages/page-one'))
const PageTwo = lazy(() => import('pages/page-two'))

const groupList: PageGroup[] = [
  {
    name: '页面列表 Page List',
    nodeList: [
      {
        path: '/page-one',
        name: '页面1 Page one',
        component: PageOne
      },
      {
        path: '/page-two',
        name: '页面2 Page two',
        component: PageTwo
      }
    ]
  }
]

function App() {
  return (
    <BrowserRouter>
      <Container header="<%= package.name %>" groupList={groupList} />
    </BrowserRouter>
  )
}

ReactDOM.render(
  <App/>,
  document.getElementById('app')
)
