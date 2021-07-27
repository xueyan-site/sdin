import ReactCSRPage from 'pro/react-csr-page'

export function getTemplateString(page: ReactCSRPage, dev: boolean) {
  let { metas, title, links, scripts, styles } = page
  if (dev) {
    title = '⚡️' + title
    const cannotUsedScripts = ['react', 'react-dom']
    scripts = scripts.filter(i => !cannotUsedScripts.includes(i.key))
  }
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <script>performance._a=Date.now()</script>
        <meta charset="UTF-8"/>
        ${page.nodesToHTML('meta', metas)}
        <title>${title}</title>
        ${page.nodesToHTML('link', links)}
        ${page.nodesToHTML('script', scripts)}
        ${page.nodesToHTML('link', styles)}
      </head>
      <body>
        <script>performance._b=Date.now()</script>
        <div id="app">${page.skeleton(page)}</div>
        <script>performance._c=Date.now()</script>
      </body>
    </html>
  `
}
