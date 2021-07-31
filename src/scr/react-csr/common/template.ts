import ReactCSRPage from 'pro/react-csr-page'

export function getTemplateString(page: ReactCSRPage, dev: boolean) {
  let { project, metas, title, links, scripts, styles } = page
  if (dev) {
    title = '⚡️' + title
    // 在开发模式下，需尽可能使用本地的包（减少CDN包，去除网络带来的阻碍）
    scripts = page.scripts.filter(i => !project.getDepVersion(i.key))
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
