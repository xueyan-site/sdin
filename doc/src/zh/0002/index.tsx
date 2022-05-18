import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
运行以下命令来创建一个新项目：

\`\`\`shell
$ xt create
\`\`\`

选择项目类型以及项目模版。此处请选择 \`package\` 和 \`react-package\`。

\`\`\`shell
11:55:55.999 xueyan-typescript-cli 2.2.13
11:55:55.999 project creation process is ready

✔ what kind of project do you want to create · package
✔ which project template do you want to use · react-package
...
\`\`\`

按提示填写项目的名称，项目的路径等信息。

\`\`\`shell
...
✔ what kind of project do you want to create · package
✔ which project template do you want to use · react-package
✔ what is the name of your project · xxx
✔ where do you want the project to be generated · /Users/abc/xxx
✔ please tell me the name of the author · abc
✔ please tell me the author's email · abc@abc.site
\`\`\`

填完上述信息之后，\`XT\` 开始初始化项目。经过一段时间的等待后，项目就创建好了。

\`\`\`shell
...
✔ package template copied successfully
...
✔ xxx node modules download successfully
...
✔ doc node modules download successfully
...
✔ xxx git repository initialized successfully
\`\`\`

> 在此过程中，可能会存在网络卡顿的情况，一般是由于网络环境不好导致的。可以按 \`Control\` + \`c\` 结束创建流程。  
> 这时，项目已经建立好了，只是没有下载依赖模块。可以在网络恢复后，进入项目根目录下，手动下载，或者更换NPM镜像源。  

## 启动项目并开始开发

选择一款称手的编辑器（这里推荐你使用 [VSCode](https://code.visualstudio.com)，打开刚才创建的项目。

在命令行中，进入项目根目录，输入 \`xt start doc\`。

\`\`\`shell
$ xt start doc
🍀 99/22/22 11:55 55.999 welcome to use xueyan-typescript-cli
🚀 99/22/22 11:55 55.999 checking project xxx-doc
🍺 99/22/22 11:55 55.999 xxx-doc has no questions

✔ xxx-doc compiler created successfully
✔ xxx-doc compiler listening on http://127.0.0.1:8080/
\`\`\`

如上所示，文档站点已经启动起来了。

请按照上面给出的网址，在浏览器中打开。

你会发现，其界面与本站点高度相似，因为它们都使用了同一个文档界面库 [xueyan-react-doc](https://xueyan.site/xueyan-react-doc)。

![](${XT_PATH}img/doc-ui.jpg)

与本站点不同的是，它支持用户在站点上改代码、看效果，这是因为它使用了代码编辑渲染库 [xueyan-react-playground](https://xueyan.site/xueyan-react-playground)。

当前界面上展示的是一个开关组件。

在编辑器中，打开 \`src\` 目录，开始开发你的组件。

> 值得注意的是，该界面本质上是一个由 \`XT\` 生成的 \`react-csr\` 类型项目，其中的文档界面、代码编辑渲染库等，都是后期配出来的，可以替换，和项目本身没有任何关系。

## 提交项目代码

开发结束之后，填写 package.json 中的 description、keywords、repository。

\`\`\`shell
{
  ...
  "description": "typescript application or package command tool",
  "keywords": [
    "cli",
    "command",
    "typescript",
    "build",
    "create",
    "node",
    "react",
    "package",
    "application"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/xueyan-site/xueyan-typescript-cli.git"
  },
  ...
}
\`\`\`

运行以下命令保存项目：

\`\`\`shell
$ git add .
$ git commit -m 'feat: add xxx component'
$ git push origin main
\`\`\`

> 如果要推送到远端，需要你将本地项目与Git远程仓库关联  
> 推荐将默认主分支设置成 main：\`git config --global init.defaultBranch main\`  

## 构建项目产物

输入构建命令。  

\`\`\`shell
$ xt build
🍀 99/22/22 11:55 55.999 welcome to use xueyan-typescript-cli
🚀 99/22/22 11:55 55.999 checking project xxx
🍺 99/22/22 11:55 55.999 xxx has no questions

✔ xxx built successfully, total 3969ms

✨  Done in 7.63s.
\`\`\`

完成之后，在项目根目录下，会生成dist文件夹，这就是项目产物。

最后，将项目产物发布到NPM平台。

\`\`\`shell
$ npm publish
\`\`\`

> 如果要发布到NPM平台，需要你先在命令行中登录NPM平台  
> 另外，待发布的包，不能与NPM平台上他人的包同名，也不能重复发布同一版本  
> 要发布的内容，可在 package.json 的 files 字段中指定

至此，一个全新的 React UI 库开发完成了。
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
