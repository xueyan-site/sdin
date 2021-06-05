module.exports = {
  type: 'react-csr',
  moduleAlias: {
    components: 'src/components',
    utils: 'src/utils'
  },
  startProxy: [
    {
      path: '^/api',
      target: 'https://xxx.com'
    }
  ]
}