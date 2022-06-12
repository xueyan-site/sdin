import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
\`\`\`shell
$ xt
Usage: xt [options] [command]

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  create          create project
  dev             develop project
  start           command <dev> alias
  build           build project to production line
  serve           open project server
  serves          serve multi projects
  track           open tracking service
  help [command]  display help for command
\`\`\`

## xt create

创建新的项目

| 参数 | 类型 | 说明 |
| - | - | - |
| name | \`? string\` | 项目名称 |
| -h, --help | \`? boolean\` | 显示帮助信息 |

有两种项目类型可供选择：

- react-csr（React 纯客户端渲染式应用程序）
- package（工具包）
  - commander（命令行工具）
  - package（Node 工具、Web 工具）
  - react-package（React 组件、React 工具）

## xt dev

启动项目，供开发者开发

| 参数 | 类型 | 说明 |
| - | - | - |
| path | \`? string\` | 项目路径 |
| -p, --port | \`? number\` | 服务器端口号（对应用程序有效） |
| -h, --help | \`? boolean\` | 显示帮助信息 |

package：监听源码的变更，刷新构建的产物。

react-csr：监听源码的变更，以开发模式构建项目，给开发者提供可实时预览的用户界面。

## xt start

\`xt dev\` 命令的别名

## xt build

构建项目产物，将代码打包成对外使用的成品

| 参数 | 类型 | 说明 |
| - | - | - |
| path | \`? string\` | 项目路径 |
| -h, --help | \`? boolean\` | 显示帮助信息 |

## xt serve

以应用程序产物为资料，启动服务器，对外提供静态资源服务。（对应用程序有效）

| 参数 | 类型 | 说明 |
| - | - | - |
| path | \`? string\` | 项目路径 |
| -p, --port | \`? number\` | 服务器端口号 |
| -h, --help | \`? boolean\` | 显示帮助信息 |

## xt serves

自动搜索应用程序，以它们的产物为资料，启动服务器，对外提供静态资源服务。（对应用程序有效）

| 参数 | 类型 | 说明 |
| - | - | - |
| path | \`? string\` | 搜索项目的路径 |
| -p, --port | \`? number\` | 服务器端口号 |
| -k, --SSLKey | \`? string\` | SSL 私钥文件路径 |
| -c, --SSLCert | \`? string\` | SSL 证书文件路径 |
| -h, --help | \`? boolean\` | 显示帮助信息 |

本命令适用于 \`多项目共建网站\` 的情况。

比如，有项目 a、b、c，分别使用公共路径 \`/a/\`，\`/b/\`，\`/\`。

将项目 a、b、c 放置于同一文件夹下（可以是不同层级），分别用 \`xt build\` 构建产物。

然后在该文件夹下，启动本命令，便可以访问它们了。

若传入 SSLKey 和 SSLCert 参数，则会启动 https 服务器对外提供服务，否则启动 http 服务器。

## xt track

为应用程序提供日志的存储和查询功能

| 参数 | 类型 | 说明 |
| - | - | - |
| -h, --help | \`? boolean\` | 显示帮助信息 |

用 docker 启动 Kibana 和 Elasticsearch，对所有项目提供日志存储和在线查询服务。

若项目内使用了打点功能，则请在启动服务器之前使用本命令，否则打点功能不起作用。  

若本地没有对应的环境，它会引导用户去配置。
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
