module.exports = {
  type: 'react-csr',
  moduleAlias: {
    components: 'src/components',
    stores: 'src/stores',
    types: 'src/types'
  },
  startProxy: [
    {
      path: '^/api',
      target: 'https://xxx.com'
    }
  ]
}