import ReactCSRPage from 'pro/react-csr-page'

export function getTemplateString(page: ReactCSRPage, dev: boolean) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <script>performance._a=Date.now()</script>
        <meta charset="UTF-8"/>
        ${page.getNodeListString('meta', page.metas)}
        <title>${dev ? '⚡️' : ''}${page.title}</title>
        ${page.getNodeListString('link', page.links)}
        ${page.getNodeListString('script', page.scripts)}
        ${page.getNodeListString('link', page.styles)}
      </head>
      <body>
        <script>performance._b=Date.now()</script>
        <div id="app">${page.skeleton(page)}</div>
        <script>performance._c=Date.now()</script>
      </body>
    </html>
  `
}
