import React, { ReactNode, ComponentType, Suspense } from 'react'
import { Switch, Route, Redirect, useRouteMatch } from 'react-router-dom'

/**
 * 路由信息  
 * route information  
 */
export interface RouteInfo extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  path: string
  component: ComponentType<any>
  name?: ReactNode
  title?: string
}

export default function RouteRender({
  routes,
  fallback
}: {
  routes: RouteInfo[]
  fallback?: NonNullable<ReactNode>
}) {
  const matched = useRouteMatch()
  const pathPre = matched.path === '/' ? '' : matched.path
  const first = routes[0]
  return (
    <Suspense fallback={fallback || null}>
      <Switch>
        {routes.map(item => (
          <Route
            exact={false}
            key={pathPre + item.path}
            path={pathPre + item.path}
            component={item.component}
          />
        ))}
        {first && (
          <Redirect key="root" path={pathPre + '/*'} to={pathPre + first.path} />
        )}
      </Switch>
    </Suspense>
  )
}
