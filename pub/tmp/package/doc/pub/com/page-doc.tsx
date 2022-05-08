import React from 'react'
import { Doc } from 'xueyan-react-doc'
import { Article, Segment } from 'xueyan-react-markdown'
import pkg from '../../../package.json'
import type { PageProps } from 'xueyan-react'
import type { ImageLinkProps, DocConfig } from 'xueyan-react-doc'
import type { SelectOption } from 'xueyan-react-select'

const ICON: ImageLinkProps = {
  src: XT_PATH + 'project.png',
  href: XT_PATH
}

const ICONS: ImageLinkProps[] = [
  {
    src: XT_PATH + 'repository.png',
    href: pkg.repository.url,
    title: 'repository',
  }
]

const VERSIONS: SelectOption<string>[] = [
  {
    value: pkg.version,
    label: pkg.version
  }
]

const LANGUAGES: SelectOption<string>[] = [
  {
    value: 'zh',
    label: '中文'
  },
  {
    value: 'en',
    label: 'English'
  }
]

const SIDE_FOOTER = `
Author [${XT_AUTHOR_NAME}](${XT_AUTHOR_EMAIL})  
Builder [xueyan-typescript-cli](https://github.com/xueyan-site/xueyan-typescript-cli)  
`

export interface PageDocProps<T,D> extends 
  PageProps,
  Omit<DocConfig<T,D>, 'icon' | 'icons' | 'versions' | 'languages'> {}

export function PageDoc<T,D>({ page, ...other }: PageDocProps<T,D>) {
  const { router, query, path, publicPath } = page
  return (
    <Doc
      {...other}
      icon={ICON}
      icons={ICONS}
      versions={VERSIONS}
      languages={LANGUAGES}
      value={query.doc}
      onChange={value => {
        router.changeUrl(path, {
          ...query,
          doc: value
        })
      }}
      onChangeLanguage={value => {
        router.changeUrl(publicPath + value, query)
      }}
    >
      <Article>
        <Segment>{SIDE_FOOTER}</Segment>
      </Article>
    </Doc>
  )
}
