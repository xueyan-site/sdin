import React from 'react'
import { PageDoc } from 'com/page-doc'
import { ConfigIcon, InterfaceIcon, ConstIcon } from 'xueyan-react-icon'
import pkg from '../../../package.json'
import type { PageProps } from 'xueyan-react'
import type { Collection } from 'xueyan-react-doc'

const INTERFACE_ICON = <InterfaceIcon color="var(--pink)"/>
const CONFIG_ICON = <ConfigIcon color="var(--indigo)"/>
const CONST_ICON = <ConstIcon color="var(--teal)"/>

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
    label: '接口文档',
    contents: [
      {
        value: '0005',
        label: '命令行接口',
        icon: INTERFACE_ICON,
        content: () => import('./0005')
      },
      {
        value: '9994',
        label: 'package 项目',
        children: [
          {
            value: '0008',
            label: 'package 项目配置',
            icon: CONFIG_ICON,
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
            label: 'react-csr 项目配置',
            icon: CONFIG_ICON,
            content: () => import('./0012')
          },
          {
            value: '0011',
            label: 'react-csr 页面配置',
            icon: CONFIG_ICON,
            content: () => import('./0011')
          },
          {
            value: '0010',
            label: 'react-csr 宏',
            icon: CONST_ICON,
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
            label: '项目配置',
            icon: CONFIG_ICON,
            content: () => import('./0006')
          },
          {
            value: '0007',
            label: '应用项目配置',
            icon: CONFIG_ICON,
            content: () => import('./0007')
          },
          {
            value: '0009',
            label: '应用项目页面配置',
            icon: CONFIG_ICON,
            content: () => import('./0009')
          }
        ]
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
      collections={COLLECTIONS}
      name={pkg.name}
      description={pkg.description}
    />
  )
}