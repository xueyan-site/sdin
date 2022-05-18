const pkg = require('../package.json')

module.exports = {
  type: 'react-csr',
  index: 'zh',
  path: pkg.name,
  alias: {
    'ast': 'pub/ast',
    'com': 'pub/com',
    'utl': 'pub/utl'
  },
  module: {
    externals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      'classnames': 'classNames',
      'lodash': '_'
    },
    rules: {
      raw: {
        test: /\.(txt|md)$/i
      }
    }
  },
  page: {
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
        href: "{{XT_PATH}}favicon.png"
      }
    ],
    styles: [
      {
        key: 'global',
        rel: 'stylesheet',
        href: '{{XT_PATH}}global.css'
      }
    ],
    scripts: [
      {
        key: 'react',
        defer: true,
        src: "https://xueyan.site/react.js"
      },
      {
        key: 'react-dom',
        defer: true,
        src: "https://xueyan.site/react-dom.js"
      },
      {
        key: 'classnames',
        defer: true,
        src: "https://xueyan.site/classnames.js"
      },
      {
        key: 'lodash',
        defer: true,
        src: "https://xueyan.site/lodash.js"
      }
    ]
  }
}