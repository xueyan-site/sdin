import React, { Fragment, useState } from 'react'
import { MarkdownSegment } from 'xueyan-react-markdown'
import Switch from '<%= package.name %>'

const code = `
\`\`\`ts
import React, { useState } from 'react'
import Switch from '<%= package.name %>'

export default function UseSwitch() {
  const [state, setState] = useState<boolean>(false)
  return <Switch value={state} onChange={setState} block={true}/>
}
\`\`\`
`

export default function UseTwo() {
  const [state, setState] = useState<boolean>(false)
  return (
    <Fragment>
      <MarkdownSegment>{code}</MarkdownSegment>
      <p>effect: </p>
      <Switch value={state} onChange={setState} block={true}/>
    </Fragment>
  )
}
