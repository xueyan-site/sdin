import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
## 下载

\`\`\`bash
npm i xueyan-react-playground
\`\`\`

\`\`\`bash
yarn add xueyan-react-playground
\`\`\`


介绍
安装
基础
  了解命令
  创建项目
  开发项目
  部署项目
开发 Package 项目

开发 ReactCSR 项目

附录
  命令行
  package project.js
  react-csr project.js
  react-csr page.js
教程

`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
