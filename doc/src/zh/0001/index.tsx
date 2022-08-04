import React from 'react'
import { Article, Segment } from 'ark-markdown'
import SUPPORT_IMG from './support.webp'
import FRAMEWORK_IMG from './framework.svg'

const MARK1 = `
\`sdin\` 是一个开发 \`Typescript\` 项目的命令行工具。

它支持 \`TS\`、 \`JS\`、 \`SCSS\`、 \`CSS\`、 \`自定义Loader\`，可以开发以下程序：

<p>
  <img src="${SUPPORT_IMG}" style="width:640px" />  
</p>

## 结构

主要工具： \`Webpack 5\` 、 \`Gulp 4\` 、 \`Koa 2\`

<p>
  <img src="${FRAMEWORK_IMG}" style="width:800px" />  
</p>

## 使用案例

- [sdin](https://github.com/xueyan-site/sdin)
- [solor](https://github.com/xueyan-site/solor)
- [stine](https://github.com/xueyan-site/stine)
- [ark-doc](https://github.com/xueyan-site/ark-doc)
- [ark-markdown](https://github.com/xueyan-site/ark-markdown)
- [ark-transition](https://github.com/xueyan-site/ark-transition)
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
