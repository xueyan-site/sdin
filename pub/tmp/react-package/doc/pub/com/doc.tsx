import React from 'react'
import Doc from 'xueyan-react-doc'
import { Segment } from 'xueyan-react-markdown'
import pkg from '../../../package.json'
import type { PageProps } from 'xueyan-react'
import type { LinkImage, LinkText, DocConfig } from 'xueyan-react-doc'

const AVATAR: LinkImage = {
  src: XT_PATH + 'project.png',
  href: XT_PATH
}

const LOGOS: LinkImage[] = [
  {
    title: 'repository',
    src: XT_PATH + 'repository.png',
    href: pkg.repository.url,
  }
]

const LANGUAGES: LinkText[] = [
  {
    label: 'English',
    href: XT_PATH + 'en'
  },
  {
    label: '中文',
    href: XT_PATH + 'zh'
  }
]

const SIDE_FOOTER = `
author - ${XT_AUTHOR_NAME}  
concat - ${XT_AUTHOR_EMAIL}  
`

export interface PageDocProps extends 
  Omit<DocConfig, 'id'|'name'|'version'|'description'|'avatar'|'logos'|'article'>,
  PageProps {}

export default function PageDoc({ page, ...other }: PageDocProps) {
  const { path, query, router } = page
  return (
    <Doc
      {...other}
      id={pkg.name}
      name={pkg.name}
      version={pkg.version}
      description={pkg.description}
      avatar={AVATAR}
      logos={LOGOS}
      languages={LANGUAGES}
      article={query.article || 'intro'}
      onChange={node => {
        router.changeUrl(path, {
          ...query,
          article: node.id
        })
      }}
    >
      <Segment>{SIDE_FOOTER}</Segment>
    </Doc>
  )
}
