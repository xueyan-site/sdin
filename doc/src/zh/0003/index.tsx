import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
涉及命令：\`xt create\`、\`xt start\`、\`xt build\`、\`xt serve\`。

## 创建一个新项目

运行以下命令：

\`\`\`shell
$ xt create
\`\`\`

选择项目类型。此处请选择 \`react-csr\`。

> react-csr 的意思是在客户端渲染的 React 网页应用程序，这样命名是为了与服务端渲染模式（SSR）进行区分。

\`\`\`shell
✔ what kind of project do you want to create · package
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

进入项目根目录，输入 \`xt start\`。

\`\`\`shell
$ xt start
✔ xxx compiler created successfully
✔ xxx compiler listening on http://127.0.0.1:8080/
\`\`\`

如上所示，服务器已经启动起来了，请在浏览器中打开命令行中提示的网址。

选择一款称手的编辑器（这里推荐你使用 [VSCode](https://code.visualstudio.com)），打开刚才创建的项目，开始开发你的网页。

## 提交项目代码

开发结束之后，修改项目中标注为\`TODO\`的地方，然后运行以下命令保存项目：

\`\`\`shell
$ git add .
$ git commit -m 'feat: save project'
\`\`\`

> 如果要推送到远端，需要你将本地项目与Git远程仓库关联。  
> 推荐将默认主分支设置成 main：\`git config --global init.defaultBranch main\`。  

## 构建项目产物并启动服务器

输入构建命令。  

\`\`\`shell
$ xt build
\`\`\`

完成之后，在项目根目录下，会生成dist文件夹，这就是项目产物。  

最后，启动服务器。

\`\`\`shell
$ xt serve
\`\`\`

## 额外补充

### 配置文件

项目的配置文件是 \`project/project.js\`，\`xt\` 会按照该文件导出的配置信息，执行相应功能。

项目的每个页面也有配置文件，一般可以省略。页面配置文件是 \`project/src/xxx-page/page.js\`。

### 目录结构上的限制

为了防止多人协作时目录结构被破坏，\`xt\` 限制开发者只能用数字、小写字母和点号命名文件和文件夹。  

\`xt\` 没有提供指定生产产物路径的配置，生成的产物只能位于 \`project/dist\` 路径下。  

不能修改 \`project/src\`、\`project/pub\`、\`project/pub/ast\` 文件夹的名称。   

\`project/src\` 下的每一个文件夹都是一个页面，不能放公共文件。公共文件只能放在 \`project/pub\` 文件夹下。  

### 宏

\`xt\` [为项目提供了宏](${XT_PATH}?doc=0010)，你可以将其当成已经定义过的全局常量来用。

### 静态资源

\`project/pub/ast\` 路径下的文件，是网站的公共静态资源，在打包时会被直接复制到产物目录下，其中的<span style="color:var(--red)"> js 和 css 文件会被压缩</span>。

\`project/pub/ast/favicon.png\` 是网站的图标，规格为 200x200。

\`project/pub/ast/global.css\` 是全局样式文件，其中包含 [normalize.css](https://github.com/necolas/normalize.css)。

### 样式主题

模版内配了[样式主题包](https://xueyan.site/xueyan-react-style)，支持暗黑主题，需要配合 \`project/pub/com/narrow-screen\` 组件或者  \`project/pub/com/wide-screen\` 组件才能生效。

若要去除，请删除这两个组件，并移除 \`xueyan-react-style\` 依赖包。

### 适配移动端

模版内为移动端场景做了适配，按照375px的设计稿宽度，1rem 等于 10px，配合 \`project/pub/com/narrow-screen\` 组件，可以呈现出移动端的自适应效果。

若要去除，请删除 \`project/pub/com/narrow-screen\` 组件，及 \`project/pub/ast/global.css\` 文件中关于设定 rem 的部分。
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
