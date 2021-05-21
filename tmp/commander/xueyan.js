module.exports = {
  type: 'package',
  buildWeb: false,
  useCompress: true,
  useMerge: true,
  moduleAlias: {
    scripts: 'src/scripts',
    utils: 'src/utils',
    types: 'src/types'
  }
}