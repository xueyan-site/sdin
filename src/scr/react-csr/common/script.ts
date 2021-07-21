import ReactCSRPage from 'pro/react-csr-page'

export function getScriptString(page: ReactCSRPage, dev: boolean) {
  return `
    import React from 'react'
    import ReactDOM from 'react-dom'
    import Index from '${page.entry}'
    ${page.container ? `import Container from '${page.container}'` : ''}
    const data = ${JSON.stringify({
      dev,
      page: {
        name: page.name,
        path: page.path,
        title: page.title
      },
      project: {
        name: page.project.name,
        path: page.project.path,
        author: page.project.author,
        version: page.project.version
      }
    })}
    ReactDOM.render(
      ${page.container ? `
        <Container {...data}>
          <Index {...data} />
        </Container>
      ` : `
        <Index {...data} />
      `},
      document.getElementById('app')
    )
  `
}
