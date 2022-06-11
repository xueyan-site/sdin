import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
在 react-csr 项目（或者专用于 react-csr 项目的包）里，你可以把这些宏当成全局常量直接使用。

| 宏名 | 值 | 描述 |
| - | - | - |
| XT_ID | project.id | 项目ID（package.name） |
| XT_TYPE | project.type | 项目类型，此处是 react-csr |
| XT_NAME | project.name | 项目名称 |
| XT_VERSION | project.version | 项目版本 |
| XT_AUTHOR | project.author | 项目作者名称 + 邮箱 |
| XT_AUTHOR_NAME | project.authorName | 项目作者名称 |
| XT_AUTHOR_EMAIL | project.authorEmail | 项目作者邮箱 |
| XT_ROOT | project.root | 项目根目录 |
| XT_ENV | 'web' | 项目产物的运行环境（web、node） |
| XT_DEV | boolean | 是否处于开发状态（不是则为生产状态） |
| XT_PUBLIC_PATH | project.publicPath | 项目url中的公共路径（以'/'开头和结尾） |
| XT_ASSETS_PATH | project.assetsPath | 项目的素材路径（以'/'开头和结尾） |
| XT_TRACK_PATH | project.trackPath | 项目打点的路径（关闭打点后，值为""） |

用 XT_ASSETS_PATH 举例：

\`xt\` 会把 react-csr 项目下的 \`pub/ast\` 目录作为公共目录。

当我们写 \`XT_ASSETS_PATH + 'favicon.png'\` 时，它指向的文件是 \`pub/ast/favicon.png\`。
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
