module.exports = {
  type: 'react-csr',
  alias: {
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