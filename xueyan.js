module.exports = {
  type: 'package',
  buildWeb: false,
  useCompress: true,
  useMerge: true,
  moduleAlias: {
    exe: "src/exe",
    pro: "src/pro",
    scr: "src/scr",
    utl: "src/utl",
    types: "src/types.ts"
  }
}