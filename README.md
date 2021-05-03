# xueyan-typescript-cli

xueyan-typescript-cli 是一个运行 typescript 代码的命令行工具。  
xueyan-typescript-cli is a typescript CLI application.

本项目创建自 xueyan <yang@xueyan.site>。  
The project created by xueyan <yang@xueyan.site>.

## 下载 Install

```bash
# 如果你使用的是NPM：
# if you use NPM: 
npm i -g xueyan-typescript-cli

# 如果你使用的是Yarn：
# if you use Yarn: 
yarn global add xueyan-typescript-cli
```

## 用法 Usage

首先，你需要下载这个包到本地全局node_modules目录中。（npm i / yarn global）  
First, you should install this package to global node modules on your computer.

然后，使用命令行去创建一个应用或者包。（xueyan-typescript create）  
Then, you should use command line to create an application or package.

最后，打开你刚创建的项目，并启动它。（cd xxx && yarn start）  
Finally, please open the project you just created, and start it.

就像这样：  
Just as:

```shell
$ npm i -g xueyan-typescript-cli
# ...
$ xueyan-typescript create
# ...
$ cd $THE_PROJECT_YOU_JUST_CREATED
# ...
$ yarn start
# ...
# ok, you can start coding.
```

## 接口 API

- [create project](#create-project)
- [start project](#start-project)
- [build project](#build-project)
- [serve project](serve-project)
- [project config](project-config)

## 创建项目 create project

你可以使用该命令来创建一个应用或者包。  
create application or package  

`xueyan-typescript create [path]`  

示例：  
For example:  

```shell
$ xueyan-typescript create
√ project type · react-application
√ package name · demo
√ project path · /.../demo
√ package author name · xueyan
√ package author email · yang@xueyan.site
√ copy project template successfully
√ downloaded node modules successfully
√ initialized git repository successfully
```

## 开发项目 start project

启动一个项目（该命令只对应用有效）  
start application (not package)  

`xueyan-typescript start [path]`  

示例：  
For example:  

```shell
$ xueyan-typescript start
i ｢wds｣: Project is running at http://localhost:8080/
i ｢wds｣: webpack output is served from undefined
i ｢wds｣: Content not from webpack is served from /.../demo/public
i ｢wds｣: 404s will fallback to /index.html
i ｢wdm｣: wait until bundle finished: /
i ｢wdm｣: Compiled successfully.
_
```

## 构建项目 build project

构建一个应用或者包（打包后的成品）  
build application or package  

`xueyan-typescript build [path] [-w, --watch]`  

示例：  
For example:

```shell
$ xueyan-typescript build
√ xueyan-typescript-cli builded successfully!
```

可以添加`--watch`选项（该选项只适用于构建包的时候）
watch option can only be used for building packages.

```shell
$ xueyan-typescript build --watch
√ xueyan-typescript-cli builded successfully!
_
```

## 运行项目 serve project

将该应用运行于HTTP服务器之上（只适用于应用）  
run application by http server (not package)  

`xueyan-typescript serve [path]`  

```shell
$ xueyan-typescript serve
[00:00:00.238 suc] demo listening on http://127.0.0.1:443!
_
```

## 项目配置 project config

本命令行生成的项目中，配置文件是**xueyan.json**。  
xueyan-typescript application or package config file is **xueyan.json**.

你可以在项目的根目录下找到它。  
please see **xueyan.json** config file in project root path.

### react-application config

```ts
interface ReactApplicationConfig {
  type: 'react-application'
  /** <http://expressjs.com/en/4x/api.html#app.listen> */
  startPort?: number
  /** <http://expressjs.com/en/4x/api.html#app.listen> */
  servePort?: number
  /** <https://webpack.docschina.org/configuration/output/#outputpublicpath> */
  startPublicPath?: string
  /** <https://webpack.docschina.org/configuration/output/#outputpublicpath> */
  buildPublicPath?: string
  /** <https://webpack.docschina.org/configuration/dev-server/#devserverproxy> */
  startProxies?: ProxyConfigArrayItem[]
  /** <https://webpack.docschina.org/configuration/dev-server/#devserverproxy> */
  serveProxies?: ProxyConfigArrayItem[]
  /** <https://webpack.docschina.org/configuration/resolve/#resolvealias> */
  moduleAlias?: Resolve['alias']
  /** <https://webpack.docschina.org/configuration/externals/> */
  moduleExternals?: ExternalsElement[]
  /** <https://webpack.docschina.org/configuration/module/#condition> */
  babelParseIncludes?: RuleSetCondition[]
  /** <https://webpack.docschina.org/configuration/module/#condition> */
  babelParseExcludes?: RuleSetCondition[]
}
```

### react-package config

```ts
interface ReactPackageConfig {
  type: 'react-package'
}
```

### node-application config

```ts
interface NodeApplicationConfig {
  type: 'node-application'
}
```

### node-package config

```ts
export interface NodePackageConfig {
  type: 'node-package'
}
```
