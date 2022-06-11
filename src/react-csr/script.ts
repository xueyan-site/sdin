import type { ReactCSRPageConfig } from './page'

export function getScriptString(page: ReactCSRPageConfig) {
  return `
import React from 'react'
import ReactDOM from 'react-dom'
import { PageProvider } from 'xueyan-react'
import Entry from ${JSON.stringify(page.entry)}

ReactDOM.render(
  <PageProvider Content={Entry}/>,
  document.getElementById('app')
)
  `
}
