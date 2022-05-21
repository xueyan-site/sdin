import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
配置文件路径：\`project/src/<xxx page>/page.js\`

> src 文件夹下的每一个文件夹，都代表一个页面。

## name

\`string = <page folder name>\`

> 默认值：页面文件夹名

页面名称。（不限语言，不限符号）

## path

\`string = <page folder name>\`

> 默认值：页面文件夹名

页面url中的路径后缀。

无论填写怎样的路径，在使用时，\`xt\` 都会确保其不以 / 开头，不以 / 结尾。

比如，填写 /aaa/，\`xt\` 会将其转化为 aaa。

它会和项目url中的公共路径（project.path）进行拼接，形成页面的完整url。

## entry

\`string = 'index.tsx'\`

指定页面入口文件。（书写相对路径时，是以当前页面文件夹路径为入口文件的参考点）

## title

\`string = page.name + '・' + project.name\`

> 默认值：当前页面名称与项目名称的拼接

指定页面的标题，它将会变成 HTML 文件中 title 标签下的内容。

## metas

\`NodeAttrs[]\`

指定插入模版的 meta 标签列表，它将会变成 HTML 文件中的多个 meta 标签。

\`\`\`ts
/**
 * 节点属性键值对
 */
export interface NodeAttrs {
  key: string
  children: string | undefined
  [prop: string]: string | boolean | undefined
}
\`\`\`

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

\`NodeAttrs[]\`

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
      href: "{{XT_PATH}}favicon.png"
    }
  ]
}
\`\`\`

上方使用的 XT_PATH 是 \`xt\` 专门提供的常量，仅限于在 NodeAttrs 类型的对象中使用。

常量列表：

| 常量名 | 值 | 描述 |
| - | - | - |
| XT_ID | project.id | 项目ID，一般是package.name |
| XT_TYPE | project.type | 项目类型，此处是react-csr |
| XT_NAME | project.name | 项目名称 |
| XT_AUTHOR | project.author | 项目作者名称 + 邮箱 |
| XT_AUTHOR_NAME | project.authorName | 项目作者名称 |
| XT_AUTHOR_EMAIL | project.authorEmail | 项目作者邮箱 |
| XT_VERSION | project.version | 项目版本 |
| XT_PATH | project.publicPath | 项目url中的公共路径（以'/'开头和结尾） |

## scripts

\`NodeAttrs[]\`

指定插入模版的 script 标签列表，它将会变成 HTML 文件中的多个 script 标签。

它排在 \`xt\` 构建的脚本前面。

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

\`NodeAttrs[]\`

指定插入模版的 link 标签列表，它将会变成 HTML 文件中的多个 link 标签。  

与 link 标签不同的是，它专用于写样式标签，\`xt\` 会对它做些处理。  

它排在 links 生成的标签后面，scripts 生成的标签前面。

示例：

\`\`\`ts
// 指定 HTML 文件的全局样式
module.exports = {
  styles: [
    {
      key: 'global',
      rel: 'stylesheet',
      href: '{{XT_PATH}}global.css'
    }
  ]
}
\`\`\`

以上标签列表，在网页中的位置如下：

\`\`\`html
<head>
  <meta charset="UTF-8"/>
  <!-- metas -->
  <title> title </title>
  <!-- links -->
  <!-- scripts -->
  <!-- styles -->
  <!-- 页面构建出的代码和样式链接 -->
</head>
\`\`\`
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
