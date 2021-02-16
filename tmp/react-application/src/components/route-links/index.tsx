import React, { useMemo } from 'react'
import classNames from 'classnames'
import { useRouteMatch, useLocation, Link } from 'react-router-dom'
import { RouteInfo } from '../route-render'
import styles from './index.module.scss'

export default function RouteLinks({
  routes,
  className,
  style
}: {
  routes: RouteInfo[]
  className?: string
  style?: React.CSSProperties
}) {
  const { pathname } = useLocation()
  const matched = useRouteMatch()
  const pathPre = matched.path === '/' ? '' : matched.path
  const pathSuf = pathname.replace(pathPre, '')

  const current = useMemo(() => {
    let currNode: RouteInfo | undefined
    for (let i = 0; i < routes.length; i++) {
      const item = routes[i]
      if (item.path && pathSuf.indexOf(item.path) === 0) {
        currNode = item
        break
      }
    }
    return currNode
  }, [routes, pathSuf])

  return (
    <div className={classNames(styles.routeLinks, className)} style={style}>
      {routes.map(item => {
        const { component, name, path, ...other } = item
        return (
          <Link 
            {...other}
            key={pathPre + path}
            to={pathPre + path}
            className={classNames(styles.routeLink, current === item && styles.active)} 
          >
            {name}
          </Link>
        )
      })}
    </div>
  )
}
