import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
在开始安装之前，请检查电脑上是否安装 Node 和 NPM（或者 Yarn）。

\`XT\` 需要 [Node.js](https://nodejs.org) v10.13.0 (LTS) 或更高版本。

你可以使用 [n](https://github.com/tj/n)，[nvm](https://github.com/creationix/nvm) 或 [nvm-windows](https://github.com/coreybutler/nvm-windows) 在一个系统中管理多个 Node 版本。

## 安装本包

使用下列任一命令安装本包：

\`\`\`shell
$ npm install -g xueyan-typescript-cli
或者
$ yarn global add xueyan-typescript-cli
\`\`\`

你可以用这个命令来查看当前本包版本：

\`\`\`shell
$ xt --version
\`\`\`

## 升级本包

如需升级本包，请使用下列任一命令：

\`\`\`shell
$ npm update -g xueyan-typescript-cli
或者
$ yarn global upgrade --latest xueyan-typescript-cli
\`\`\`

## 找不到本包

安装失败，命令行显示找不到本包时，你可以尝试用以下命令，检查本地NPM配置：

\`\`\`shell
$ npm config get registry
或者
$ yarn config get registry
\`\`\`

如果结果显示不是 <https://registry.npmjs.org>，则需要修改 registry。

\`\`\`shell
$ npm config set registry https://registry.npmjs.org
或者
$ yarn config set registry https://registry.npmjs.org
\`\`\`

然后，重新执行安装命令即可。

如果你只想本次下载时采用此源，可以在安装时临时指定镜像源。

\`\`\`shell
$ npm install -g xueyan-typescript-cli --registry https://registry.npmjs.org
或者
$ yarn global add xueyan-typescript-cli --registry https://registry.npmjs.org
\`\`\`

## 下载速度太慢

因网络环境和镜像源服务器原因，可能导致下载速度非常慢。

这时，你可以选择使用国内的源。

\`\`\`shell
$ npm config set registry https://registry.npm.taobao.org
或者
$ yarn config set registry https://registry.npm.taobao.org
\`\`\`

或者，在安装时临时指定镜像源。

\`\`\`shell
$ npm install -g xueyan-typescript-cli --registry https://registry.npm.taobao.org
或者
$ yarn global add xueyan-typescript-cli --registry https://registry.npm.taobao.org
\`\`\`

另外，你还可以选择换用CNPM。

\`\`\`shell
$ npm install -g cnpm --registry=https://registry.npm.taobao.org
$ cnpm install -g xueyan-typescript-cli
\`\`\`

## 查询本包信息

查看远程镜像源中，本包的最新版本：

\`\`\`shell
$ npm info xueyan-typescript-cli version
或者
$ yarn info xueyan-typescript-cli version
\`\`\`

查看远程镜像源中，本包的最新版本详细信息：

\`\`\`shell
$ npm info xueyan-typescript-cli
或者
$ yarn info xueyan-typescript-cli
\`\`\`

查看本地本包的版本列表和位置

\`\`\`shell
$ npm list -g xueyan-typescript-cli
\`\`\`
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
