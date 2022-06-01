import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
配置文件：\`project.js\`

> 此处仅列出应用项目独有的配置，更多配置参数请见 [项目配置](?doc=0006)。

## path

\`string = /\`

项目url中的公共路径。

无论填写怎样的路径，在使用时，\`xt\` 都会确保其以 / 开头，以 / 结尾。

比如，填写 aaa，\`xt\` 会将其转化为 /aaa/。
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
