/**
 * @package xueyan-react-pages
 * @author xueyan <yang@xueyan.site>
 * @description doc entry
 */

import React, { lazy } from 'react'
import Pages, { PageSources } from 'xueyan-react-pages'
import styles from './index.module.scss'

const Interface1 = lazy(() => import('./interface1'))
const Interface2 = lazy(() => import('./interface2'))

const sources: PageSources = {
  zh: {
    header: 'xueyan-react-pages',
    groupList: [
      {
        name: 'API',
        nodeList: [
          {
            path: '/interface1',
            name: '接口1',
            component: Interface1
          },
          {
            path: '/interface2',
            name: '接口2',
            component: Interface2
          }
        ]
      }
    ]
  },
  en: {
    header: 'xueyan-react-pages',
    groupList: [
      {
        name: 'API',
        nodeList: [
          {
            path: '/interface1',
            name: '接口1',
            component: Interface1
          },
          {
            path: '/interface2',
            name: '接口2',
            component: Interface2
          }
        ]
      }
    ]
  }
}

export default function Example1() {
  return (
    <div className={styles.example1}>
      <Pages sources={sources} />
    </div>
  )
}
