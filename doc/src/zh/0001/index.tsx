import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'
import { Video } from 'com/video'
import SUPPORT_IMG from './support.webp'
import FRAMEWORK_IMG from './framework.svg'
import INTRO_VDO from './intro.webm'
import WEBSITE_IMG from './website.webp'
import BUILD_IMG from './build.webp'

const MARK1 = `
\`xueyan-typescript-cli\`（简称 \`xt\`），是一个 \`Typescript\` 项目开发工具，可开发：

<p>
  <img src="${SUPPORT_IMG}" style="width:640px" />  
</p>

## 组织架构

组成： \`Webpack 5\` + \`Gulp 4\` + \`Koa 2\`

支持： \`TS\`、\`JS\`、\`SCSS\`、\`CSS\`、\`自定义Loader\`

<p>
  <img src="${FRAMEWORK_IMG}" style="width:800px" />  
</p>

## 项目构建性能

实验机器：Mac OS，8G 内存，6MB 三级缓存，2.3GHz 4核单处理器

项目初始：构建时长 5s

普通情况：构建时长 5-20s

<p>
  <img src="${BUILD_IMG}" style="width:800px" />  
</p>

## 应用项目初始界面

<p>
  <img src="${WEBSITE_IMG}" style="width:800px" />  
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
