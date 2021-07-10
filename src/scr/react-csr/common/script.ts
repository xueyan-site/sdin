import ReactCSRPage from 'pro/react-csr-page'

export function getScriptString(page: ReactCSRPage, dev: boolean) {
  const { entry, container } = page.config
  return `
    import React from 'react'
    import ReactDOM from 'react-dom'
    import Index from '${entry}'
    ${container && `import Container from '${container}'`}
    const data = ${JSON.stringify({
      dev,
      page: {
        name: page.name,
        path: page.path,
        title: page.config.title
      },
      project: {
        name: page.project.name,
        path: page.project.path,
        author: page.project.author,
        version: page.project.version
      }
    })}
    ReactDOM.render(
      ${container ? `
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
