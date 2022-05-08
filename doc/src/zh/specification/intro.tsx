import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}

const MARK1 = `
![](${XT_PATH}project.png)

欢迎你阅读 \`xueyan-typescript-cli\` 的制作规范。

> 本文只约定 \`XT\` 对外提供的功能和对外的表现，不涉及具体实现。
> 为方便阅读，在本文后续内容中，一律称 \`xueyan-typescript-cli\` 为 \`XT\`。

## 介绍

\`XT\` 是一个命令行工具，用于开发 Typescript 相关软件包或应用程序，兼容 windows、linux、mac 操作系统。

\`XT\` 当前的版本是 \`2.x.x\`（x代表任意数字）。

## 主命令

\`XT\` 对外提供的主命令是 \`xt\`。

> 主命令只负责查看命令相关信息。

输入 \`xt\`，命令行会打印工具的名称、版本、作者、协议和描述。

输入 \`xt\` 任意命令时，会优先进行以下步骤：

1、打印工具的名称和版本。
2、检查一天之内是否打印过提示更新的信息。
  2.1、是，跳过。
  2.2、检查最新版本号，是否存在可更新的版本。
    2.2.1、是，打印提示更新的信息。信息包括当前版本、可更新版本和更新的方式。
    2.2.2、否，跳过。

## 子命令

\`XT\` 包括五个子命令：create、start、build、serve、track。分别负责：创建项目、开发项目、构建项目、伺服项目、启动日志服务器。
`
