import React, { ReactNode, ComponentType, useMemo, Suspense, useState, useEffect } from 'react'
import classNames from 'classnames'
import { Link, Switch, Route, Redirect, useLocation, matchPath, useRouteMatch } from 'react-router-dom'
import styles from './index.module.scss'

/**
 * 单个页面节点  
 * single page node  
 */
export interface PageNode extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  path: string
  name: ReactNode
  noTitle?: boolean
  component: ComponentType<any>
}

/**
 * 文档页面组  
 * document pages group  
 */
export interface PageGroup {
  name?: ReactNode
  nodeList: PageNode[]
}

/**
 * 暗黑主题键  
 * dark theme key  
 */
const DARK_KEY = 'xueyan-react-pages-dark-theme'

export default function Container({
  header,
  groupList,
  ...style
}: {
  header: ReactNode
  groupList: PageGroup[]
} & Pick<React.CSSProperties, 'width' | 'height'>) {
  const { pathname } = useLocation()
  const { path } = useRouteMatch()
  const [ dark, setDark ] = useState<boolean>(true)
  const [ visible, setVisible ] = useState<boolean>(false)

  const pathPre = path === '/' ? '' : path
  const pathSuf = pathname.replace(pathPre, '')

  useEffect(() => {
    if (localStorage) {
      if (localStorage.getItem(DARK_KEY)) {
        setDark(true)
      }
    }
  }, [])

  const first = useMemo(() => {
    const group = groupList.find(i => i.nodeList.length > 0)
    return group && group.nodeList[0]
  }, [groupList])

  const current = useMemo(() => {
    let currNode: PageNode | undefined
    for (let i = 0; i < groupList.length; i++) {
      const pageGroup = groupList[i]
      const nodeList = pageGroup.nodeList
      for (let j = 0; j < nodeList.length; j++) {
        const node = nodeList[j]
        if (node.path && pathSuf.indexOf(node.path) === 0) {
          currNode = node
          break
        }
      }
    }
    return currNode
  }, [groupList, pathSuf])

  const openMenu = () => setVisible(true)
  const closeMenu = () => setVisible(false)
  const toggleDark = () => {
    setDark(!dark)
    if (localStorage) {
      if (dark) {
        localStorage.removeItem(DARK_KEY)
      } else {
        localStorage.setItem(DARK_KEY, 'true')
      }
    }
  }

  return (
    <div 
      style={style}
      className={classNames(styles.wrapper, visible && styles.visible, dark && styles.dark)}
    >
      <div className={styles.side}>
        <div className={styles.sideHeader}>
          {header}
        </div>
        {groupList.map((pages, index) => (
          <div className={styles.menuGroup} key={index}>
            {pages.name && (
              <div className={styles.menuName}>{pages.name}</div>
            )}
            {pages.nodeList.map(item => {
              const { component, name, noTitle, path, ...other } = item
              return (
                <Link 
                  {...other}
                  key={path}
                  className={classNames(styles.menuNode, current === item && styles.active)} 
                  to={path}
                  onClick={closeMenu}
                >
                  {name}
                </Link>
              )
            })}
          </div>
        ))}
        <div className={styles.settings}>
          <div className={styles.switcher} onClick={toggleDark}/>
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.mainInner}>
          <div className={styles.menu} onClick={openMenu}>menu</div>
          <article className={styles.mainBody}>
            <Suspense fallback={null}>
              <Switch>
                {groupList.map(pages => (
                  pages.nodeList.map(item => (
                    <Route
                      exact={false}
                      key={item.path}
                      path={item.path}
                      component={item.component}
                    />
                  ))
                ))}
                {first && (
                  <Redirect key="root" path="*" to={first.path} />
                )}
              </Switch>
            </Suspense>
          </article>
        </div>
      </div>
      <div className={styles.mask} onClick={closeMenu}></div>
    </div>
  )
}
