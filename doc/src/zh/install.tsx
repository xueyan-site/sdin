import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
欢迎您阅读\`xueyan-typescript-cli\`的使用文档。  

`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
