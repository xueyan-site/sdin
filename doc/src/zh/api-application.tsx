import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
本文展示应用项目的配置文件参数。

> 此处仅列应用项目特有配置，更多配置参数请见 “接口字典 / 项目配置”。

## path

\`string = /\`

> 默认值为 /

项目url中的公共路径。

无论填写怎样的路径，在使用时，\`XT\` 都会确保其以 / 开头，以 / 结尾。

比如，填写 aaa，\`XT\` 会将其转化为 /aaa/。
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
