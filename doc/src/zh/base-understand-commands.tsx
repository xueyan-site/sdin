import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
\`XT\` 定义的命令是 "xt" 。

在命令行中输入 "xt" 并回车，命令行会打印 \`XT\` 的介绍信息。

\`\`\`shell
$ xt
Usage: xt [options] [command]

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  create          create project
  start           develop or debug project on browser
  build           build project to production line
  serve           open project server
  track           start tracking services
  ...
\`\`\`

开发者一般使用的是它的子命令。

下面为你介绍一下开发时常用的命令。

## xt create

\`xt create\` 命令用于创建项目。

\`\`\`shell
$ xt create
🍀 99/22/22 11:55 55.999 welcome to use xueyan-typescript-cli
🍀 99/22/22 11:55 55.999 project creation process is ready

✔ what kind of project do you want to create · package
✔ which project template do you want to use · package
✔ what is the name of your project · xxx
✔ where do you want the project to be generated · /Users/abc/xxx
✔ please tell me the name of the author · abc
✔ please tell me the author's email · abc@abc.site

✔ package template copied successfully
...
✔ xxx node modules download successfully
...
✔ doc node modules download successfully
...
✔ xxx git repository initialized successfully
\`\`\`

## xt start

\`xt start\` 命令用于启动项目，供开发者开发程序。

\`\`\`shell
$ xt start
🍀 99/22/22 11:55 55.999 welcome to use xueyan-typescript-cli
🚀 99/22/22 11:55 55.999 checking project xxx
🍺 99/22/22 11:55 55.999 xxx has no questions

✔ xxx built successfully, total 2095ms
\`\`\`

启动后，按 \`Control\` + \`c\`，即可结束当前状态。

## xt build

\`xt build\` 命令用于构建项目，生产项目产物。

\`\`\`shell
$ xt build
🍀 99/22/22 11:55 55.999 welcome to use xueyan-typescript-cli
🚀 99/22/22 11:55 55.999 checking project test-package
🍺 99/22/22 11:55 55.999 test-package has no questions

✔ xxx built successfully, total 2156ms

✨  Done in 5.73s.
\`\`\`

## xt serve

\`xt serve\` 命令用于开启服务。

它会启动服务器，使其以 \`xt build\` 命令构建出的项目产物为资料，对外提供网络访问服务。

\`\`\`shell
$ xt serve
🍀 99/22/22 11:55 55.999 welcome to use xueyan-typescript-cli

ℹ xxx server password is aaaabbbb-cccc-1111-2222-333344445555
✔ xxx server listening on http://127.0.0.1:443/
\`\`\`

启动后，按 \`Control\` + \`c\`，即可结束当前状态。

## 项目与命令

以上四个命令，是使用 \`XT\` 时最常用的命令，也是 \`XT\` 的主要命令。

命令 \`create\`、\`start\`、\`build\` 对开发工具和应用程序都适用。命令 \`serve\` 只用于应用程序。

为了符合大众习惯，\`XT\` 在项目模版里配置了别称。你可以通过 \`yarn start\`、\`yarn build\` 来启动或构建项目。
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
