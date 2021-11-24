import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'
import Video from 'com/video'

const MARK1 = `
欢迎你阅读 \`xueyan-typescript-cli\` 的使用文档。  

为方便阅读，在本文后续内容中，一律称 \`xueyan-typescript-cli\` 为 \`XT\`。  

\`XT\` 是围绕 Typescript 语言制作的命令行工具，可用于开发：  

![](${XT_PATH}img/support.webp)

## 特点

1、以 Typescript 语言为核心。

2、支持开发服务端、浏览器端的包，组件，应用。

3、命令少，配置简单，项目目录结构清晰。

4、工具内部对项目本身的依赖少（工具升级对项目的影响小）。

5、项目模版完整度高（组件模版配有演示文档，其效果参考本站）。

6、应用项目，使用 \`SCSS\` 作为样式预处理语言。

7、应用项目，内置宏，内置埋点功能，配有专门的工具包（[xueyan-react](https://xueyan.site/xueyan-react)）。

8、开放源代码，免费。

## 技术架构

\`XT\` 使用 Koa2 建立服务，使用 Webpack5 打包项目，使用 Gulp4 搭建流水线，完成项目的开发、构建和部署。

\`XT\` 为应用项目配置了埋点功能，结合 Docker、Kibana、ElasticSearch 数据库，完成日志的收集、存储和查询。

![](${XT_PATH}img/framework.svg)

## 使用过程

你可通过下方的演示，了解 \`XT\` 的使用过程。  

> 下面演示的是React组件包项目的创建和启动过程。（视频经过了剪辑和加速处理）  
`

const MARK2  = `
## 代码库

\`XT\` 代码库，使用 \`XT\` 自身作为开发工具。  

代码库的地址是：<https://github.com/xueyan-site/xueyan-typescript-cli>。  

## 图标
`

const STYLE1: React.CSSProperties = {
  backgroundColor: '#fff',
  width: '200px'
}

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
      <Video src={XT_PATH+'intro-demo.webm'} />
      <Segment>{MARK2}</Segment>
      <img style={STYLE1} src={XT_PATH+'project.png'}/>
    </Article>
  )
}
