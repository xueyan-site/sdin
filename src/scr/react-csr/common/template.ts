import ReactCSRPage from 'pro/react-csr-page'

export function getTemplateString(page: ReactCSRPage, dev: boolean) {
  const { title, metas, links, scripts, styles, skeleton } = page.config
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <script>window._t1_=Date.now()</script>
        <meta charset="UTF-8"/>
        ${page.nodesToString('meta', metas)}
        <title>${dev?'⚡️':''}${title}</title>
        ${page.nodesToString('link', links)}
        ${page.nodesToString('script', scripts, true)}
        ${page.nodesToString('link', styles)}
      </head>
      <body>
        <script>window._t2_=Date.now()</script>
        <div id="app">${skeleton(page)}</div>
        <script>window._t3_=Date.now()</script>
      </body>
    </html>
  `
}
