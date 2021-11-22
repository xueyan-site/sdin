import React from 'react'
import { Article, Segment } from 'xueyan-react-markdown'

const MARK1 = `
本文展示 react-csr 项目的配置文件参数。

> 此处仅列 react-csr 项目特有配置，更多配置参数请见 “接口字典 / 应用项目配置”。

## index

\`undefined | string\`

指定项目的根页面。（即指定当访问URL为项目公共路径时，应当返回的页面）

不指定，或指定页面不存在，则当用户访问时，按照找不到页面来处理。

## error

\`undefined | string\`

指定项目的错误兜底页面。（即指定当访问URL不存在时，应当返回的页面）

不指定，或指定页面不存在，则提示用户找不到页面。

## track

\`boolean | ESClientOptions = true\`

> 默认值为 true，即开启状态，此时使用默认配置连接本机默认端口  
> 支持自定义配置，参数详见 <https://github.com/elastic/elasticsearch-js#documentation>

是否开启打点功能。

若关闭，则使用 \`xueyan-react\` 工具进行打点时无效。

注意：打点功能，需要配合 \`xt track\` 命令使用，要求机器安装 docker，且会占用机器的内存资源和硬盘资源。若不需要统计数据，建议关闭。

## page

\`undefined | Partial<ReactCSRPageConfig>\`

> ReactCSRPageConfig 见文章 “接口字典 / react-csr page.js”

与页面相关的全局默认配置。

若在页面目录下，没有配置相关项，则继承此处的配置。

## module

\`undefined | Partial<ReactCSRModuleConfig>\`

与模块相关的配置信息。

### 1. externals

\`{ [key: string]: string }\`

> 具体用法详见：<https://webpack.docschina.org/configuration/externals/>  
> 注意，请确保 key 是包名，value 是全局变量名。\`XT\` 不会保证 Webpack 提及的其它写法有效  

防止将某些 import 的包打包到 bundle 中，而是在运行时，再去从外部获取这些扩展依赖。  

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

> 具体用法详见：<https://webpack.docschina.org/configuration/module/#ruleinclude>

babel 转换 JS 文件时，指定覆盖的模块范围。

### 3. babelExcludes

\`RuleSetCondition[]\`

> 具体用法详见：<https://webpack.docschina.org/configuration/module/#ruleexclude>

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

> RuleSetRule：详见 <https://webpack.docschina.org/configuration/module/#modulerules>
> 不允许修改 test、parser.dataUrlCondition.maxSize。

修改现有模块规则。

目前规则如下：

| name | type | suffix |
| - | - | - |
| raw | asset/source | txt |
| font | asset | woff woff2 eot ttf otf |
| image | asset | png jpg jpeg svg webp gif bmp tif |
| audio | asset | mp3 wma wav aac amr ogg |
| video | asset | mp4 3gp webm mpg avi wmv flv |

### 5. loaders

\`RuleSetRule[]\`

> RuleSetRule：详见 <https://webpack.docschina.org/configuration/module/#modulerules>

添加额外模块规则。

## serve

\`undefined | Partial<ReactCSRServeConfig>\`

配置服务信息。

### 1. port

\`number = 443\`

> 默认值为 443

指定服务启动的端口。

### 2. proxies

\`ProxyOptions[]\`

> ProxyOptions：详见 <https://github.com/edorivai/koa-proxy>

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

### 1. port

\`number = 8080\`

> 默认值为 8080

指定服务启动的端口。

### 2. proxies

\`ProxyOptions[]\`

> ProxyOptions：详见 <https://github.com/edorivai/koa-proxy>

配置代理。若没有配置，则继承 serve.proxies 的配置。

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
