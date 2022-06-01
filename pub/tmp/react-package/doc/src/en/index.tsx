import React from 'react'
import { PageDoc } from 'com/page-doc'
import pkg from '../../../package.json'
import type { PageProps } from 'xueyan-react'
import type { Collection } from 'xueyan-react-doc'

const COLLECTIONS: Collection<string,string>[] = [
  {
    value: '9999',
    label: 'Guide',
    contents: [
      {
        value: '0001',
        label: 'Introduction',
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
