import React from 'react'
import { PageDoc } from 'com/page-doc'
import pkg from '../../../package.json'
import type { PageProps } from 'xueyan-react'
import type { Collection } from 'xueyan-react-doc'

const COLLECTIONS: Collection<string,string>[] = [
  {
    value: '1',
    label: 'collection 1',
    contents: [
      {
        value: '1-1',
        label: 'chapter 1: introduction',
        content: () => import('./0001')
      }
    ]
  }
]

export default function Index(props: PageProps) {
  return (
    <PageDoc 
      {...props}
      language="en"
      version={pkg.version}
      collections={COLLECTIONS}
      name={pkg.name}
      description={pkg.description}
    />
  )
}
