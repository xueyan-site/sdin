import ReactCSRPage from 'pro/react-csr-page'

export function getScriptData(page: ReactCSRPage) {
  return {
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
  }
}

export function getScriptString(page: ReactCSRPage) {
  return `
    import React, { useEffect } from 'react'
    import ReactDOM from 'react-dom'
    import Entry from '${page.entry}'
    ${page.container ? `import Container from '${page.container}'` : ''}
    const data = ${JSON.stringify(getScriptData(page))}
    const App = () => {
      performance._d=Date.now()
      useEffect(() => {
        performance._e=Date.now()
      })
      return ${page.container ? `(
        <Container {...data}>
          <Entry {...data} />
        </Container>
      )` : '<Entry {...data} />'}
    }
    ReactDOM.render(<App />, document.getElementById('app'))
  `
}
