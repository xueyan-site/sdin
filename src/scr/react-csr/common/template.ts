import type { ReactCSRPage } from 'pro/react-csr-page'

function getPageData(page: ReactCSRPage) {
  return {
    id: page.id,
    name: page.name,
    pagePath: page.path,
    publicPath: page.project.publicPath,
    privatePath: page.privatePath
  }
}

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
        <meta charset="UTF-8"/>
        ${page.nodesToHTML('meta', metas)}
        <title>${title}</title>
        <script>window.XT_PAGE=${JSON.stringify(getPageData(page))}</script>
        ${page.nodesToHTML('link', links)}
        ${page.nodesToHTML('script', scripts)}
        ${page.nodesToHTML('link', styles)}
      </head>
      <body>
        <div id="app">
          ${page.skeleton(page)}
        </div>
      </body>
    </html>
  `
}
