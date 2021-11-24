import React from 'react'
import Doc from 'com/doc'
import type { PageProps } from 'xueyan-react'
import type { ArticleMeta } from 'xueyan-react-doc'

const CONTENTS: ArticleMeta[] = [
  {
    id: 'intro',
    label: '介绍',
    content: () => import('./intro')
  }
]

export default function Index(props: PageProps) {
  return <Doc {...props} language="中文" contents={CONTENTS} />
}
