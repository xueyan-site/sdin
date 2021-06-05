module.exports = {
  type: 'package',
  buildWeb: false,
  useCompress: true,
  useMerge: true,
  moduleAlias: {
    executors: "src/executors",
    projects: "src/projects",
    scripts: "src/scripts",
    utils: "src/utils",
    types: "src/types.ts"
  }
}