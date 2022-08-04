import React from 'react'
import { Article, Segment } from 'ark-markdown'

const MARK1 = `
配置文件：\`src/<xxx>/page.js\`

| 属性 | 名称 | 类型 | 说明 |
| - | - | - | - |
| name | 页面名称 | \`? string\` | 中英文都可以，默认 页面文件夹名 |
| path | URL 页面路径后缀 | \`? string\` | 默认 页面文件夹名 |
| entry | 页面入口文件 | \`? string\` | 默认 'index.tsx' |
| title | 页面的标题 | \`? string\` | 默认 'pageName ・ projectName' |
| metas | meta 标签列表 | \`? NodeAttrs\` | |
| links | link 标签列表 | \`? NodeAttrs\` | |
| scripts | script 标签列表 | \`? NodeAttrs\` | |
| styles | link 标签列表（样式） | \`? NodeAttrs\` | |
| skeleton | 渲染HTML骨架 | \`? ReactCSRPageSkeleton\` | |

## path

\`? string\`

页面url中的路径后缀，默认值是页面文件夹名

无论填写怎样的路径，在使用时，\`sdin\` 都会确保其不以 / 开头，不以 / 结尾。

比如，填写 /aaa/，\`sdin\` 会将其转化为 aaa。

它会和项目url中的公共路径（project.path）进行拼接，形成页面的完整url。

## entry

\`? string\`

指定页面入口文件，默认值是 'index.tsx'

书写相对路径时，是以当前页面文件夹路径为入口文件的参考点。

## title

\`? string\`

指定页面的标题，它将会变成 HTML 文件中 title 标签下的内容。

默认值是 page.name + '・' + project.name

## NodeAttrs

HTML 标签属性描述对象

\`\`\`ts
interface NodeAttrs extends Record<string, string|boolean|undefined> {
  key: string
  children?: string
}
\`\`\`

## NodeAttrs 常量表

\`sdin\` 提供的常量，仅限于在 NodeAttrs 类型的对象中使用。

| 常量名 | 值 | 描述 |
| - | - | - |
| P_ID | project.id | 项目ID（package.name） |
| P_TYPE | project.type | 项目类型，此处是react-csr |
| P_NAME | project.name | 项目名称 |
| P_AUTHOR | project.author | 项目作者名称 + 邮箱 |
| P_AUTHOR_NAME | project.authorName | 项目作者名称 |
| P_AUTHOR_EMAIL | project.authorEmail | 项目作者邮箱 |
| P_VERSION | project.version | 项目版本 |
| P_PUBLIC_PATH | project.publicPath | 项目url中的公共路径（以'/'开头和结尾） |
| P_ASSETS_PATH | project.assetsPath | 项目的素材路径（以'/'开头和结尾） |

## 标签属性

\`sdin\` 支持配置 \`metas\`、\`links\`、\`scripts\`、\`styles\` 四种标签属性。

它们在 HTML 中的位置如下：

\`\`\`html
<head>
  <meta charset="UTF-8"/>
  <!-- metas -->
  <title>标题</title>
  <!-- links -->
  <!-- scripts -->
  <!-- styles -->
  <!-- 页面构建出的代码和样式链接 -->
</head>
\`\`\`

## metas

\`? NodeAttrs[]\`

指定插入模版的 meta 标签列表，它将会变成 HTML 文件中的多个 meta 标签。

示例：

\`\`\`ts
// 指定 HTML 文件的显示方式
module.exports = {
  metas: [
    {
      key: 'viewport',
      name: 'viewport',
      content: 'viewport-fit=cover,width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no'
    }
  ]
}
\`\`\`

## links

\`? NodeAttrs[]\`

指定插入模版的 link 标签列表，它将会变成 HTML 文件中的多个 link 标签。

示例：

\`\`\`ts
// 指定 HTML 文件的 Favicon
module.exports = {
  links: [
    {
      key: 'favicon',
      rel: "icon",
      type: "image/png",
      href: "{{P_ASSETS_PATH}}favicon.png"
    }
  ]
}
\`\`\`


## scripts

\`? NodeAttrs[]\`

指定插入模版的 script 标签列表，它将会变成 HTML 文件中的多个 script 标签。

它排在 \`sdin\` 构建的脚本前面。

示例：

\`\`\`ts
// 指定 HTML 文件需要加载的 react 脚本
module.exports = {
  scripts: [
    {
      key: 'react',
      defer: true,
      src: 'https://cdn.xxx.com/react.pro.min.js'
    }
  ]
}
\`\`\`

## styles

\`? NodeAttrs[]\`

指定插入模版的 link 标签列表，它将会变成 HTML 文件中的多个 link 标签。  

与 link 标签不同的是，它专用于写样式标签，\`sdin\` 会对它做些处理。  

它排在 links 生成的标签后面，scripts 生成的标签前面。

示例：

\`\`\`ts
// 指定 HTML 文件的全局样式
module.exports = {
  styles: [
    {
      key: 'global',
      rel: 'stylesheet',
      href: '{{P_ASSETS_PATH}}global.css'
    }
  ]
}
\`\`\`

## skeleton

\`? ReactCSRPageSkeleton\`

\`\`\`ts
undefined | (
  root: string,                  // 项目文件夹路径
  pkg: PackageInfo,              // 包信息
  pjtCfg: ReactCSRProjectConfig, // 项目配置
  pgCfg: ReactCSRPageConfig,     // 页面配置
  dev: boolean                   // 是否是开发
) => string
\`\`\`

HTML 骨架图渲染器

\`sdin\` 会将它的输出结果，注入 HTML 的 body 中，作为页面的初始内容展示给用户。

可以用它结合 puppeteer 和骨架屏组件，在打包时，做页面的预渲染工作。
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
