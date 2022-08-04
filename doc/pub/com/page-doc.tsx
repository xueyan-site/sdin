import React from 'react'
import 'solor'
import { Doc } from 'ark-doc'
import { Article, Segment } from 'ark-markdown'
import pkg from '../../../package.json'
import type { PageProps } from 'sdin-react'
import type { ImageLinkProps, DocConfig } from 'ark-doc'
import type { SelectOption } from 'ark-select'

const ICON: ImageLinkProps = {
  src: P_ASSETS_PATH + 'project.png',
  href: P_PUBLIC_PATH
}

const ICONS: ImageLinkProps[] = [
  {
    src: P_ASSETS_PATH + 'repository.png',
    href: pkg.repository.url,
    title: 'repository',
  },
  {
    src: P_ASSETS_PATH + 'favicon.png',
    href: '/',
    title: 'website'
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
Author [${P_AUTHOR_NAME}](mailto://${P_AUTHOR_EMAIL})  
Builder [sdin](https://github.com/xueyan-site/sdin)  
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
      onChangeLanguage={value => {
        router.changeUrl(publicPath + value, query)
      }}
      getHref={option => {
        return router.formatUrl(path, {
          ...query,
          doc: option.value
        })
      }}
    >
      <Article>
        <Segment>{SIDE_FOOTER}</Segment>
      </Article>
    </Doc>
  )
}
