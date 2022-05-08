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

// const CONTENTS: ArticleMeta[] = [
//   {
//     id: 'intro',
//     label: '介绍',
//     content: () => import('./intro')
//   },
//   {
//     id: 'install',
//     label: '安装',
//     content: () => import('./manual/install')
//   },
//   {
//     id: 'base',
//     label: '基础教程',
//     children: [
//       {
//         id: 'base-understand-commands',
//         label: '了解命令',
//         content: () => import('./base-understand-commands')
//       },
//       {
//         id: 'base-develop-package',
//         label: '开发工具包',
//         content: () => import('./base-develop-package')
//       },
//       {
//         id: 'base-develop-application',
//         label: '开发应用程序',
//         content: () => import('./base-develop-application')
//       }
//     ]
//   },
//   {
//     id: 'pro',
//     label: '高级教程',
//     children: [
//       {
//         id: 'pro',
//         label: '了解命令',
//         content: () => import('./base-understand-commands')
//       }
//     ]
//   },
//   {
//     id: 'api',
//     label: '程序接口',
//     children: [
//       {
//         id: 'api-commands',
//         label: '命令列表',
//         content: () => import('./api-commands')
//       },
//       {
//         id: 'api-project',
//         label: '项目配置',
//         content: () => import('./api-project')
//       },
//       {
//         id: 'api-appication',
//         label: '应用项目配置',
//         content: () => import('./api-application')
//       },
//       {
//         id: 'api-page',
//         label: '页面配置',
//         content: () => import('./api-page')
//       },
//       {
//         id: 'api-package-project',
//         label: 'package 项目配置',
//         content: () => import('./api-package-project')
//       },
//       {
//         id: 'api-react-csr-project',
//         label: 'react-csr 项目配置',
//         content: () => import('./api-react-csr-project')
//       },
//       {
//         id: 'api-react-csr-page',
//         label: 'react-csr 页面配置',
//         content: () => import('./api-react-csr-page')
//       },
//       {
//         id: 'api-react-csr-define',
//         label: 'react-csr 宏',
//         content: () => import('./api-react-csr-define')
//       }
//     ]
//   }
// ]

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
