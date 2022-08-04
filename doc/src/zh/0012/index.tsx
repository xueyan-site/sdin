import React from 'react'
import { Article, Segment } from 'ark-markdown'

const MARK1 = `
配置文件：\`project.js\`

| 属性 | 名称 | 类型 | 说明 |
| - | - | - | - |
| type | 项目类型 | \`'package'\` | 请勿修改 |
| name | 项目名称 | \`? string\` | 中英文都可以，默认 package.json/name |
| alias | 文件（夹）路径的别名 | \`? Record<string, string>\` | |
| path | URL 公共路径 | \`? string\` | 默认 '/' |
| index | 根页面路径 | \`? string\` | |
| error | 错误页面路径 | \`? string\` | |
| track | 打点配置项 | \`? boolean,ESClientOptions\` | |
| develop | 开发配置项 | \`? Partial<ReactCSRDevelopConfig>\` | |
| serve | 服务配置项 | \`? Partial<ReactCSRServeConfig>\` | |
| module | 模块配置项 | \`? Partial<ReactCSRModuleConfig>\` | |
| page | 项目页面默认配置 | \`? Partial<ReactCSRPageUserConfig>\` | |

## alias

\`? Record<string, string>\`

配置文件（夹）路径的别名

示例如下，配置文件夹 \`src/foo\` 别名为 \`foo\` ：

\`\`\`js
module.exports = {
  alias: {
    foo: "src/foo"
  }
}
\`\`\`

配置别名之后，在 tsconfig.json 中添加一下 path。

\`\`\`json
{
  "compilerOptions": {
    "paths": {
      "foo/*": ["./src/foo/*"]
    }
  }
}
\`\`\`

## path

\`? string\`

项目url中的公共路径

无论填写怎样的路径，\`sdin\` 都会确保其以 / 开头，以 / 结尾。

比如，填写 aaa，\`sdin\` 会将其转化为 /aaa/。

## index

\`? string\`

指定项目的根页面路径（当访问URL为项目公共路径时，应当返回的页面的路径）。

不指定，或指定页面路径不存在，则按照 “404” 状态来处理。

## error

\`? string\`

指定项目的错误兜底页面路径（当访问URL不存在时，应当返回的页面）。

不指定，或指定页面路径不存在，则返回 “404” 状态。

## track

\`? boolean,ESClientOptions\`

开启打点功能（若直接配置 ES 客户端连接参数，则相当于开启了打点功能）

> 其他类型：[ESClientOptions](https://github.com/elastic/elasticsearch-js#documentation)

若未开启，使用 [xueyan-react](https://xueyan.site/xueyan-react) 工具打点时无效。

打点功能需要配合 \`sdin track\` 命令使用，要求机器安装 docker、Kibana 和 ElasticSearch，且会占用机器资源。  

运行 \`sdin track\` 命令时，工具会自行检测是否安装它们，以及告知用户安装方法。

## develop

\`? Partial<ReactCSRDevelopConfig>\`

专用于开发的配置项

\`\`\`
interface ReactCSRDevelopConfig {
  port: number
  proxies: ProxyOptions[]
}
\`\`\`

## develop.port

\`number\`

指定服务启动的端口，默认是 8080 端口

## develop.proxies

\`ProxyOptions[]\`

配置后端接口代理

> 其他类型：[ProxyOptions](https://github.com/edorivai/koa-proxy)

若没有配置，则继承 <a href="#serve.proxies">serve.proxies</a> 的配置。

示例：

\`\`\`ts
module.exports = {
  develop: {
    proxies: [
      {
        match: /^\/api\//,
        host: 'https://xxx.com'
      }
    ]
  }
}
\`\`\`

## serve

\`? Partial<ReactCSRServeConfig>\`

专用于服务的配置项

\`\`\`
interface ReactCSRServeConfig {
  port: number
  proxies: ProxyOptions[]
  SSLKey?: string
  SSLCert?: string
}
\`\`\`

## serve.port

\`number\`

指定服务启动的端口，HTTP 默认是 80 端口，HTTPS 默认是 443 端口

## serve.proxies

\`ProxyOptions[]\`

配置后端接口代理

> 其他类型：[ProxyOptions](https://github.com/edorivai/koa-proxy)

示例：

\`\`\`ts
module.exports = {
  develop: {
    proxies: [
      {
        match: /^\/api\//,
        host: 'https://xxx.com'
      }
    ]
  }
}
\`\`\`

## serve.SSLKey

\`? string\`

HTTPS SSL 私钥文件路径

## serve.SSLCert

\`? string\`

HTTPS SSL 证书文件路径

配置 SSLKey 和 SSLCert 后，HTTPS 生效，否则使用 HTTP

## page

\`? Partial<ReactCSRPageUserConfig>\`

与页面相关的全局配置项

> 其他类型：[ReactCSRPageUserConfig](?doc=0011)

若在页面目录下，没有配置相关项，则继承此处的配置。

## module

\`? Partial<ReactCSRModuleConfig>\`

与模块相关的配置信息

\`\`\`
interface ReactCSRModuleConfig {
  externals: Record<string, string>
  babelIncludes: RuleSetCondition[]
  babelExcludes: RuleSetCondition[]
  rules: ReactCSRModuleConfigRules
  loaders: RuleSetRule[]
}
\`\`\`

## module.externals

\`Record<string, string>\`

webpack 的 externals 配置项

> 注意：externals 中，每项的 key 是包名，value 是全局变量名  

具体用法见 <https://webpack.docschina.org/configuration/externals/>  

配合 [page.scripts](?doc=0011#scripts) 选项，可实现在打包时剔除常用的模块，改为从 CDN 下载。  

示例：

\`\`\`js
// 不再打包 react 和 react-dom，而是从CDN下载 React 和 ReactDOM。  
module.exports = {
  module: {
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM'
    }
  },
  page: {
    scripts: [
      {
        key: 'react',
        defer: true,
        src: "https://xxx.com/react.js"
      },
      {
        key: 'react-dom',
        defer: true,
        src: "https://xxx.com/react-dom.js"
      }
    ]
  }
}
\`\`\`

## module.babelIncludes

\`RuleSetCondition[]\`

babel 转换 JS 文件时，指定覆盖的模块范围。

> 其他类型：[RuleSetCondition](https://webpack.docschina.org/configuration/module/#condition)   

具体用法见 <https://webpack.docschina.org/configuration/module/#ruleinclude> 

## module.babelExcludes

\`RuleSetCondition[]\`

babel 转换 JS 文件时，指定不覆盖的模块范围。

> 其他类型：[RuleSetCondition](https://webpack.docschina.org/configuration/module/#condition)   

具体用法见 <https://webpack.docschina.org/configuration/module/#ruleexclude> 

示例：

\`\`\`js
// 不再用 babel 编译目录 pub/pkg 下的文件
module.exports = {
  module: {
    babelExcludes: [/pub\\\/pkg/]
  }
}
\`\`\`

## module.rules

\`ReactCSRModuleConfigRules\`

修改 Webpack 文件打包规则。

\`\`\`ts
interface ReactCSRModuleConfigRules {
  raw?: Partial<RuleSetRule>   // 文本打包规则
  font?: Partial<RuleSetRule>  // 字体打包规则
  image?: Partial<RuleSetRule> // 图片打包规则
  audio?: Partial<RuleSetRule> // 音频打包规则
  video?: Partial<RuleSetRule> // 视频打包规则
}
\`\`\`

> 其他类型：[RuleSetRule](https://webpack.docschina.org/configuration/module/#modulerules)   
> 无法修改 \`test\`、\`parser.dataUrlCondition.maxSize\`  

目前规则如下：

| 名称 | 类型 | 匹配文件后缀 |
| - | - | - |
| raw | asset/source | txt |
| font | asset | woff woff2 eot ttf otf |
| image | asset | png jpg jpeg svg webp gif bmp tif |
| audio | asset | mp3 wma wav aac amr ogg |
| video | asset | mp4 3gp webm mpg avi wmv flv |

## module.loaders

\`RuleSetRule[]\`

添加额外的 Webpack 文件打包规则

> 其他类型：[RuleSetRule](https://webpack.docschina.org/configuration/module/#modulerules)
`

export default function Main() {
  return (
    <Article>
      <Segment>{MARK1}</Segment>
    </Article>
  )
}
