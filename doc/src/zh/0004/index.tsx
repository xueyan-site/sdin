import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
在开始安装之前，请检查电脑上是否安装 Node 和 NPM（ 或者 Yarn）。

\`sdin\` 需要 [Node.js](https://nodejs.org) v10.13.0 (LTS) 或更高版本。

你可以使用 [n](https://github.com/tj/n)，[nvm](https://github.com/creationix/nvm) 或 [nvm-windows](https://github.com/coreybutler/nvm-windows) 在一个系统中管理多个 Node 版本。

## 安装本包

\`\`\`shell
$ npm install -g sdin
\`\`\`

你可以用这个命令来查看当前本包版本：

\`\`\`shell
$ sdin --version
\`\`\`

## 升级本包

\`\`\`shell
$ npm update -g sdin
\`\`\`

## 找不到本包

安装失败，命令行显示找不到本包时，尝试用以下命令，检查本地 NPM 配置：

\`\`\`shell
$ npm config get registry
\`\`\`

如果结果显示不是 <https://registry.npmjs.org>，则需要修改 registry。

\`\`\`shell
$ npm config set registry https://registry.npmjs.org
\`\`\`

然后，重新执行安装命令即可。

如果只想本次下载时采用此源，可以在安装时临时指定镜像源。

\`\`\`shell
$ npm install -g sdin --registry https://registry.npmjs.org
\`\`\`

## 下载速度太慢

因网络环境和镜像源服务器原因，可能导致下载速度慢。这时，可以选择使用国内的源。

\`\`\`shell
$ npm config set registry https://registry.npm.taobao.org
\`\`\`

在安装时临时指定镜像源。

\`\`\`shell
$ npm install -g sdin --registry https://registry.npm.taobao.org
\`\`\`

你也可以选择用 CNPM 代替 NPM 。

\`\`\`shell
$ npm install -g cnpm --registry=https://registry.npm.taobao.org
$ cnpm install -g sdin
\`\`\`

## 查询本包信息

查看远程镜像源中，本包的最新版本：

\`\`\`shell
$ npm info sdin version
\`\`\`

查看远程镜像源中，本包的最新版本详细信息：

\`\`\`shell
$ npm info sdin
\`\`\`

查看本地本包的版本列表和位置

\`\`\`shell
$ npm list -g sdin
\`\`\`
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
