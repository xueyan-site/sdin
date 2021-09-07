import React, { Fragment, useState } from 'react'
import { MarkdownSegment } from 'xueyan-react-markdown'
import Playground from 'xueyan-react-playground'
import Switch from '<%= name %>'

const mark1 = `
## 常规用法
`

const code1 = `
import React, { useState } from 'react'
import Switch from '<%= name %>'

export default function UseSwitch() {
  const [state, setState] = useState<boolean>(false)
  return (
    <Fragment>
      switch: <Switch value={state} onChange={setState}/>
    </Fragment>
  )
}
`

const mark2 = `
## 显示为块级元素
`

const code2 = `
import React, { useState } from 'react'
import Switch from '<%= name %>'

export default function UseSwitch() {
  const [state, setState] = useState<boolean>(false)
  return (
    <Fragment>
      switch: <Switch block={true} value={state} onChange={setState}/>
    </Fragment>
  )
}
`

const scope = { React, useState, Switch, Fragment }

export default function Use() {
  return (
    <Fragment>
      <MarkdownSegment>{mark1}</MarkdownSegment>
      <Playground code={code1} scope={scope} />
      <MarkdownSegment>{mark2}</MarkdownSegment>
      <Playground code={code2} scope={scope} />
    </Fragment>
  )
}
