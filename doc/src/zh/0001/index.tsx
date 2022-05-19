import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'
import SUPPORT_IMG from './support.webp'
import FRAMEWORK_IMG from './framework.svg'
import INTRO_VDO from './intro.webm'
import { Video } from 'com/video'

const MARK1 = `
> 📣：为了阅读方便，本文将 \`xueyan-typescript-cli\`  简称为 \`xt\`。  

\`xt\` 是一个 Typescript 语言命令行工具，可开发：

<p>
  <img src="${SUPPORT_IMG}" style="width:800px" />  
</p>

> 💡：\`xt\` 和本文档，是通过 \`xt\` 开发的。  

## 架构

主要组成： \`Webpack 5\` + \`Gulp 4\` + \`Koa 2\`

支持的语言： \`Typescript\`、\`Javascript\`、\`SCSS\`、\`CSS\`（支持自定义Loader）

<p>
  <img src="${FRAMEWORK_IMG}" style="width:800px" />  
</p>
`

export default function Main() {
  return (
    <Article>
      <Video src={INTRO_VDO} />
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
