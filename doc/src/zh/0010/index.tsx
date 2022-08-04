import React from 'react'
import { Article, Segment } from 'ark-markdown'

const MARK1 = `
| 宏名 | 值 | 描述 |
| - | - | - |
| P_ID | project.id | 项目ID，即 package.name |
| P_TYPE | project.type | 项目类型，此处是 react-csr |
| P_NAME | project.name | 项目名称 |
| P_VERSION | project.version | 项目版本 |
| P_AUTHOR | project.author | 项目作者名称 + 邮箱 |
| P_AUTHOR_NAME | project.authorName | 项目作者名称 |
| P_AUTHOR_EMAIL | project.authorEmail | 项目作者邮箱 |
| P_ROOT | project.root | 项目根目录 |
| P_ENV | 'web' | 项目产物的运行环境（web、node） |
| P_DEV | boolean | 是否处于开发状态（不是则为生产状态） |
| P_PUBLIC_PATH | project.publicPath | 项目url中的公共路径（以'/'开头和结尾） |
| P_ASSETS_PATH | project.assetsPath | 项目的素材路径（以'/'开头和结尾） |
| P_TRACK_PATH | project.trackPath | 项目打点的路径（关闭打点后，值为""） |

在 react-csr 项目中，或者专用于 react-csr 项目的包里，可以直接使用这些宏（相当于全局常量）。

用 \`P_ASSETS_PATH\` 举例：

\`sdin\` 会把 react-csr 项目下的 \`pub/ast\` 目录作为公共目录。

当我们写 \`P_ASSETS_PATH + 'favicon.png'\` 时，它指向的文件是 \`pub/ast/favicon.png\`。
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
