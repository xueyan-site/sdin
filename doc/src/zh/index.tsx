import React from 'react'
import { PageDoc } from 'com/page-doc'
import pkg from '../../../package.json'
import type { PageProps } from 'xueyan-react'
import type { Collection } from 'xueyan-react-doc'

const COLLECTIONS: Collection<string,string>[] = [
  {
    value: '9999',
    label: '指南',
    contents: [
      {
        value: '0001',
        label: '介绍',
        content: () => import('./0001')
      },
      {
        value: '0004',
        label: '安装',
        content: () => import('./0004')
      },
      {
        value: '0002',
        label: '开发包（以React组件为例）',
        content: () => import('./0002')
      },
      {
        value: '0003',
        label: '开发网页应用',
        content: () => import('./0003')
      }
    ]
  },
  {
    value: '9998',
    label: '配置',
    contents: [
      {
        value: '0005',
        label: '命令行接口',
        content: () => import('./0005')
      },
      {
        value: '9994',
        label: 'package 项目',
        children: [
          {
            value: '0008',
            label: 'package 项目的配置信息',
            content: () => import('./0008')
          }
        ]
      },
      {
        value: '9996',
        label: 'react-csr 项目',
        children: [
          {
            value: '0012',
            label: 'react-csr 项目的配置信息',
            content: () => import('./0012')
          },
          {
            value: '0011',
            label: 'react-csr 项目的页面配置信息',
            content: () => import('./0011')
          },
          {
            value: '0010',
            label: 'react-csr 宏',
            content: () => import('./0010')
          }
        ]
      },
      {
        value: '9995',
        label: '其它配置',
        children: [
          {
            value: '0006',
            label: '项目的配置信息',
            content: () => import('./0006')
          },
          {
            value: '0007',
            label: '应用项目的配置信息',
            content: () => import('./0007')
          },
          {
            value: '0009',
            label: '应用项目的页面配置信息',
            content: () => import('./0009')
          }
        ]
      }
    ]
  },
  // {
  //   value: '9997',
  //   label: '常见用法',
  //   contents: [
  //     {
  //       value: '3-1',
  //       label: '章一 介绍',
  //       content: () => import('./0001')
  //     }
  //   ]
  // }
]

export default function Index(props: PageProps) {
  return (
    <PageDoc 
      {...props}
      language="zh"
      version={pkg.version}
      collections={COLLECTIONS}
      name={pkg.name}
      description={pkg.description}
    />
  )
}


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
