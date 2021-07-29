module.exports = {
  container: '../../pub/com/container',
  skeleton: ({ name, config }) => `
    <div>${name}</div>
    <div>${config.title}</div>
  `
}
