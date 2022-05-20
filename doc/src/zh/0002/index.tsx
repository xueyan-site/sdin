import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
\`xt\` 支持开发的包类型有：Node 工具包、Web 工具包、命令行工具、React 组件。

涉及命令：\`xt create\`、\`xt start doc\`、\`xt build\`。

> 此处仅介绍 react 组件的开发过程，其它类型的包开发过程与其相同。

## 创建一个新项目

运行以下命令：

\`\`\`shell
$ xt create
\`\`\`

选择项目类型以及项目模版。此处请选择 \`package\` 和 \`react-package\`。

\`\`\`shell
✔ what kind of project do you want to create · package
✔ which project template do you want to use · react-package
\`\`\`

按提示填写项目的名称，项目的路径等信息。

\`\`\`shell
✔ what is the name of your project · xxx
✔ where do you want the project to be generated · /Users/abc/xxx
✔ please tell me the name of the author · abc
✔ please tell me the author's email · abc@abc.site
\`\`\`

填完上述信息之后，\`xt\` 开始初始化项目。经过一段时间的等待后，项目就创建好了。

> 在此过程中，可能会存在网络卡顿的情况，一般是由于网络环境不好导致的，可以按 \`Control\` + \`c\` 结束创建流程。  
> 中断下载过程对项目无碍，项目已经建立好了，只是没有依赖模块。可以在网络恢复后，进入项目根目录下，手动下载。  

## 启动项目

进入项目根目录，输入 \`xt start doc\`。

\`\`\`shell
$ xt start doc
✔ xxx-doc compiler created successfully
✔ xxx-doc compiler listening on http://127.0.0.1:8080/
\`\`\`

如上所示，文档站点已经启动起来了，请在浏览器中打开命令行中提示的网址。

选择一款称手的编辑器（这里推荐你使用 [VSCode](https://code.visualstudio.com)），打开刚才创建的项目，开始开发你的组件。

## 提交项目代码

开发结束之后，修改项目中标注为\`TODO\`的地方。

然后填写 package.json 中的 description、keywords、repository。

最后，运行以下命令保存项目：

\`\`\`shell
$ git add .
$ git commit -m 'feat: save project'
\`\`\`

> 如果要推送到远端，需要你将本地项目与Git远程仓库关联。  
> 推荐将默认主分支设置成 main：\`git config --global init.defaultBranch main\`。  

## 构建项目产物

输入构建命令。  

\`\`\`shell
$ xt build
\`\`\`

完成之后，在项目根目录下，会生成dist文件夹，这就是项目产物。  

最后，将项目产物发布到NPM平台。  

\`\`\`shell
$ npm publish
\`\`\`

> 发布NPM包，需要先在命令行中登录NPM平台。  
> 待发布的包，不能与NPM平台上他人的包同名，也不能重复发布同一版本。  
> 要发布的内容，可在 package.json 的 files 字段中指定。  
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
