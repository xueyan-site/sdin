import React from 'react'
import { PageDoc } from 'com/page-doc'
import pkg from '../../../package.json'
import type { PageProps } from 'xueyan-react'
import type { DocumentInfo } from 'xueyan-react-doc'

const DOCUMENTS: DocumentInfo<string,string>[] = [
  {
    value: '1',
    label: '集一',
    contents: [
      {
        value: '1-1',
        label: '章一 介绍',
        content: () => import('./0001')
      }
    ]
  }
]

export default function Index(props: PageProps) {
  return (
    <PageDoc 
      {...props}
      language="zh"
      version={pkg.version}
      documents={DOCUMENTS}
      name={pkg.name}
      description={pkg.description}
    />
  )
}
