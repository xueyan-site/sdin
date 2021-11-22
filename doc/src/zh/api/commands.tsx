import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
本文展示 \`XT\` 的命令及其参数的意义和用法。

## xt create

\`\`\`shell
$ xt create --help
Usage: create [options] [path]

create project

Options:
  -h, --help  display help for command
\`\`\`

创建项目。

目前有两种项目类型可供选择：

- package（用于开发 Node 工具包、Web 工具包、命令行工具、React 组件包）
- react-csr（用于开发 React 纯客户端渲染式应用程序）

## xt start

\`\`\`shell
$ xt start --help
Usage: start [options] [path]

develop or debug project on browser

Options:
  -h, --help  display help for command
\`\`\`

启动项目，供开发者开发。

package 项目中，它监听源码的改变后，刷新构建的产物。

react 应用程序中，它不仅监听源码的变更，还负责以开发模式构建项目，给开发者提供可实时预览的用户界面。

## xt build

\`\`\`shell
$ xt build --help
Usage: build [options] [path]

build project to production line

Options:
  -h, --help  display help for command
\`\`\`

构建项目产物，将代码打包成可以对外使用的成品。

## xt serve

\`\`\`shell
$ xt serve --help
Usage: serve [options] [path]

open project server

Options:
  -p, --password  server password
  -h, --help      display help for command
\`\`\`

启动服务器，以项目产物为资料，对外提供静态资源服务。（只用于应用程序）

\`-p\`：服务器密码，用于对外提供保密功能。若不传，则每次启动时，服务器都会生成一串随机码来作为它的密码。

## xt track

\`\`\`shell
$ xt track --help
Usage: track [options]

start tracking services

Options:
  -h, --help  display help for command
\`\`\`

为应用程序提供日志的存储和在线查询功能。

它用 docker 启动 Kibana 和 Elasticsearch，对所有项目提供日志存储和在线查询服务。

若项目启用了打点功能，则在使用命令 \`xt serve\` 之前，务必确保机器上启动了本命令，否则打点功能无效。  

若本地没有安装 docker，它会给出提示。
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
