import ReactCSRPage from 'pro/react-csr-page'

export function getTemplateString(page: ReactCSRPage, dev: boolean) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <script>window._t1_=Date.now()</script>
        <meta charset="UTF-8"/>
        ${page.getNodeListString('meta', page.metas)}
        <title>${dev ? '⚡️' : ''}${page.title}</title>
        ${page.getNodeListString('link', page.links)}
        ${page.getNodeListString('script', page.scripts)}
        ${page.getNodeListString('link', page.styles)}
      </head>
      <body>
        <script>window._t2_=Date.now()</script>
        <div id="app">${page.skeleton(page)}</div>
        <script>window._t3_=Date.now()</script>
      </body>
    </html>
  `
}
