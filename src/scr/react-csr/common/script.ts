import { escapePath } from 'utl/path'
import type ReactCSRPage from 'pro/react-csr-page'

export function getScriptString(page: ReactCSRPage) {
  return `
    import React from 'react'
    import ReactDOM from 'react-dom'
    import { PageProvider } from 'xueyan-react'
    import Entry from '${escapePath(page.entry)}'
    ReactDOM.render(
      <PageProvider Content={Entry}/>,
      document.getElementById('app')
    )
  `
}
