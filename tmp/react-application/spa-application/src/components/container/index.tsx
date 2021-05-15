import React from 'react'
import styles from './index.module.scss'
import RouteLinks from '../route-links'
import RouteRender, { RouteInfo } from '../route-render'

export default function Container({
  routes
}: {
  routes: RouteInfo[]
}) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <RouteLinks routes={routes}></RouteLinks>
      </div>
      <RouteRender routes={routes}></RouteRender>
    </div>
  )
}
