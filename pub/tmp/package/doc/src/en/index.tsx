import React from 'react'
import Doc from 'com/doc'
import type { PageProps } from 'xueyan-react'
import type { ArticleMeta } from 'xueyan-react-doc'

const CONTENTS: ArticleMeta[] = [
  {
    id: 'intro',
    label: 'Introduction',
    content: () => import('./intro')
  }
]

export default function Index(props: PageProps) {
  return <Doc {...props} language="English" contents={CONTENTS} />
}
