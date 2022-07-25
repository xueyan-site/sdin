import type { ReactCSRPageConfig } from './page'

export function getScriptString(page: ReactCSRPageConfig) {
  return `
import React from 'react'
import { createRoot } from 'react-dom/client'
import { PageProvider } from 'sdin-react'
import Entry from ${JSON.stringify(page.entry)}

const root = createRoot(document.getElementById('app'))
root.render(<PageProvider Content={Entry}/>)
  `
}
