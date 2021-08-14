import { escapePath } from 'utl/path'
import type ReactCSRPage from 'pro/react-csr-page'

export function getPageData(page: ReactCSRPage) {
  return {
    id: page.id,
    name: page.name,
    pagePath: page.path,
    trackPath: page.project.trackPath,
    publicPath: page.project.publicPath,
    privatePath: page.privatePath
  }
}

export function getScriptString(page: ReactCSRPage) {
  return `
    import React from 'react'
    import ReactDOM from 'react-dom'
    import { PageProvider } from 'xueyan-react'
    import Entry from '${escapePath(page.entry)}'
    const page = ${JSON.stringify(getPageData(page))}
    ReactDOM.render((
      <PageProvider page={page}>
        <Entry page={page} />
      </PageProvider>
    ), document.getElementById('app'))
  `
}
