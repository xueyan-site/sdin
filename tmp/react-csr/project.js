module.exports = {
  type: 'react-csr',
  index: 'page-one',
  error: 'page-error',
  alias: {
    src: 'src',
    api: 'pub/api',
    ast: 'pub/ast',
    com: 'pub/com',
    utl: 'pub/utl',
  },
  start: {
    proxy: [
      {
        path: '^/api',
        target: 'https://xxx.com'
      }
    ]
  },
  module: {
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      classnames: 'classNames',
      lodash: '_'
    }
  },
  page: {
    title: '<%= name %>',
    metas: [
      {
        key: 'ie',
        'http-equiv': 'X-UA-Compatible',
        content: 'ie=edge'
      },
      {
        key: 'viewport',
        name: 'viewport',
        content: 'viewport-fit=cover,width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no'
      }
    ],
    links: [
      {
        key: 'favicon',
        rel: "icon",
        type: "image/png",
        href: "/favicon.png"
      }
    ],
    styles: [
      {
        key: 'global',
        rel: 'stylesheet',
        href: '/index.css'
      },
      {
        key: 'normalize',
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.min.css'
      }
    ],
    scripts: [
      {
        key: 'react',
        defer: true,
        src: 'https://cdn.jsdelivr.net/npm/react@16.12.0/umd/react.production.min.js'
      },
      {
        key: 'react-dom',
        defer: true,
        src: 'https://cdn.jsdelivr.net/npm/react-dom@16.12.0/umd/react-dom.production.min.js'
      },
      {
        key: 'classnames',
        defer: true,
        src: 'https://cdn.jsdelivr.net/npm/classnames@2.3.1/index.min.js'
      },
      {
        key: 'lodash',
        defer: true,
        src: 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js'
      }
    ]
  }
}
