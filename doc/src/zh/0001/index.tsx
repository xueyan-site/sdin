import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'
import { Video } from 'com/video'
import SUPPORT_IMG from './support.webp'
import FRAMEWORK_IMG from './framework.svg'
import INTRO_VDO from './intro.webm'
import PACKAGE_DEV_IMG from './package-dev.webp'
import REACT_CSR_DEV_IMG from './react-csr-dev.webp'
import REACT_CSR_BUILD_IMG from './react-csr-build.webp'

const MARK1 = `
\`sdin\`（简称 \`sdin\`），是一个 \`Typescript\` 项目开发工具，可开发：

<p>
  <img src="${SUPPORT_IMG}" style="width:640px" />  
</p>

## 组织架构

组成： \`Webpack 5\` + \`Gulp 4\` + \`Koa 2\`

支持： \`TS\`、\`JS\`、\`SCSS\`、\`CSS\`、\`自定义Loader\`

<p>
  <img src="${FRAMEWORK_IMG}" style="width:800px" />  
</p>

## 应用构建性能

实验机器：Mac OS，8G 内存，2.3 GHz 4核单处理器

项目初始：构建时长 5s

普通情况：构建时长 5-20s

<p>
  <img src="${REACT_CSR_BUILD_IMG}" style="width:800px" />  
</p>

## 应用开发初始效果

<p>
  <img src="${REACT_CSR_DEV_IMG}" style="width:800px" />  
</p>

## 工具包开发初始效果

<p>
  <img src="${PACKAGE_DEV_IMG}" style="width:800px" />  
</p>

## 开发者参考实例

- [sdin](https://github.com/xueyan-site/sdin)
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
