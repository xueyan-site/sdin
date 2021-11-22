import React from 'react'
import Doc from 'xueyan-react-doc'
import { Segment } from 'xueyan-react-markdown'
import pkg from '../../../package.json'
import type { PageProps } from 'xueyan-react'
import type { LinkImage, DocConfig } from 'xueyan-react-doc'

const AVATAR: LinkImage = {
  src: XT_PATH + 'img/project.png',
  href: XT_PATH
}

const LOGOS: LinkImage[] = [
  {
    title: 'github',
    src: XT_PATH + 'img/github.png',
    href: pkg.repository.url,
  },
  {
    title: 'xueyan-site',
    src: XT_PATH + 'img/xueyan-site.svg',
    href: 'https://xueyan.site',
  }
]

const SIDE_FOOTER = `
author - [${XT_AUTHOR_NAME}](https://xueyan.site)  
concat - ${XT_AUTHOR_EMAIL}  
builder - [xueyan-typescript-cli](https://github.com/xueyan-site/xueyan-typescript-cli)
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
