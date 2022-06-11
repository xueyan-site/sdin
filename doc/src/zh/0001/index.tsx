import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'
import SUPPORT_IMG from './support.webp'
import FRAMEWORK_IMG from './framework.svg'
import INTRO_VDO from './intro.webm'
import { Video } from 'com/video'

const MARK1 = `
\`xueyan-typescript-cli\`（简称 \`xt\`），是一个 Typescript 语言命令行工具，可开发：

<p>
  <img src="${SUPPORT_IMG}" style="width:800px" />  
</p>

## 架构

组成： \`Webpack 5\` + \`Gulp 4\` + \`Koa 2\`

支持： \`TS\`、\`JS\`、\`SCSS\`、\`CSS\`、\`自定义Loader\`

<p>
  <img src="${FRAMEWORK_IMG}" style="width:800px" />  
</p>

## 使用方

- [xueyan-typescript-cli](https://github.com/xueyan-site/xueyan-typescript-cli)
- [xueyan-react-doc](https://github.com/xueyan-site/xueyan-react-doc)
- [xueyan-react-markdown](https://github.com/xueyan-site/xueyan-react-markdown)
- [xueyan-react-style](https://github.com/xueyan-site/xueyan-react-style)
- [xueyan-react-transition](https://github.com/xueyan-site/xueyan-react-transition)
- [xueyan-react-store](https://github.com/xueyan-site/xueyan-react-store)
`

export default function Main() {
  return (
    <Article>
      <Video src={INTRO_VDO} />
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
