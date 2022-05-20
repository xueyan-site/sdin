import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
配置文件路径：\`project/project.js\`

> 此处仅列出 react-csr 项目独有的配置，更多配置参数请见 [应用项目的配置信息](${XT_PATH}?doc=0007)。

## index

\`undefined | string\`

指定项目的根页面。（即指定当访问URL为项目公共路径时，应当返回的页面）

不指定，或指定页面不存在，则当用户访问时，按照找不到页面来处理。

## error

\`undefined | string\`

指定项目的错误兜底页面。（即指定当访问URL不存在时，应当返回的页面）

不指定，或指定页面不存在，则提示用户找不到页面。

## track

\`boolean | ESClientOptions = false\`

> ESClientOptions：<https://github.com/elastic/elasticsearch-js#documentation>

是否开启打点功能。

若未开启，则使用 [xueyan-react](https://xueyan.site/xueyan-react) 工具进行打点时无效。

> 打点功能需要配合 \`xt track\` 命令使用，要求机器安装 docker、Kibana 和 ElasticSearch，且会占用机器资源。  
> 运行 \`xt track\` 命令时，工具会自行检测是否安装它们，以及告知用户安装方法。

## page

\`undefined | Partial<ReactCSRPageConfig>\`

> ReactCSRPageConfig： [react-csr 项目的页面配置信息](${XT_PATH}?doc=0011)

与页面相关的全局默认配置。

若在页面目录下，没有配置相关项，则继承此处的配置。

## module

\`undefined | Partial<ReactCSRModuleConfig>\`

与模块相关的配置信息。

### 1. externals

\`{ [key: string]: string }\`

> 具体用法：<https://webpack.docschina.org/configuration/externals/>  
> 注意，请确保 key 是包名，value 是全局变量名。\`xt\` 不会保证 Webpack 提及的其它写法有效  

防止将某些 import 的包打包到 bundle 中，而是在运行时，再去从外部获取这些扩展依赖。  

> 配合 [page.scripts](${XT_PATH}?doc=0009#scripts) 选项，可实现在打包时剔除常用的模块，改为由网页从 CDN 上下载。  

示例：

\`\`\`js
// 打包时，不再引入 react 和 react-dom 包，而是从全局读取 React 和 ReactDOM 变量来代替它们。  
module.exports = {
  module: {
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM'
    }
  }
}
\`\`\`

### 2. babelIncludes

\`RuleSetCondition[]\`

> 具体用法：<https://webpack.docschina.org/configuration/module/#ruleinclude>  

babel 转换 JS 文件时，指定覆盖的模块范围。

### 3. babelExcludes

\`RuleSetCondition[]\`

> 具体用法：<https://webpack.docschina.org/configuration/module/#ruleexclude>  

babel 转换 JS 文件时，指定不覆盖的模块范围。

示例：

\`\`\`js
// 不再用 babel 编译目录 pub/pkg 下的文件
module.exports = {
  module: {
    babelExcludes: [
      /pub\/pkg/
    ]
  }
}
\`\`\`

### 4. rules

\`\`\`ts
{
  raw?: Partial<RuleSetRule>
  font?: Partial<RuleSetRule>
  image?: Partial<RuleSetRule>
  audio?: Partial<RuleSetRule>
  video?: Partial<RuleSetRule>
}
\`\`\`

> RuleSetRule：<https://webpack.docschina.org/configuration/module/#modulerules>  
> 注意：无法修改 test、parser.dataUrlCondition.maxSize。  

修改 Webpack 文件打包规则。

目前规则如下：

| 名称 | 类型 | 匹配文件后缀 |
| - | - | - |
| raw | asset/source | txt |
| font | asset | woff woff2 eot ttf otf |
| image | asset | png jpg jpeg svg webp gif bmp tif |
| audio | asset | mp3 wma wav aac amr ogg |
| video | asset | mp4 3gp webm mpg avi wmv flv |

### 5. loaders

\`RuleSetRule[]\`

> RuleSetRule：<https://webpack.docschina.org/configuration/module/#modulerules>  

添加额外的 Webpack 文件打包规则。

## serve

\`undefined | Partial<ReactCSRServeConfig>\`

配置服务信息。

### serve.port

\`number = 443\`

指定服务启动的端口。

### serve.proxies

\`ProxyOptions[]\`

> ProxyOptions：<https://github.com/edorivai/koa-proxy>  

配置代理。

示例：

\`\`\`ts
module.exports = {
  serve: {
    proxies: [
      {
        match: /^\/api\//,
        host: 'https://xxx.com'
      }
    ]
  }
}
\`\`\`

## start

\`undefined | Partial<ReactCSRStartConfig>\`

配置服务信息。（只用于开发期间）

### start.port

\`number = 8080\`

指定服务启动的端口。

### start.proxies

\`ProxyOptions[]\`

> ProxyOptions：<https://github.com/edorivai/koa-proxy>  

配置代理。若没有配置，则继承 <a href="#serve.proxies">serve.proxies</a> 的配置。

示例：

\`\`\`ts
module.exports = {
  start: {
    proxies: [
      {
        match: /^\/api\//,
        host: 'https://xxx.com'
      }
    ]
  }
}
\`\`\`
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
