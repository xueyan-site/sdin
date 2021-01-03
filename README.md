# xueyan-typescript-cli

xueyan-typescript-cli is a typescript CLI application.

The project created by xueyan <yang@xueyan.site>.

## Install

- NPM: `npm i -g xueyan-typescript-cli`  
- YARN: `yarn global add xueyan-typescript-cli`  

## Usage

First, you should install this package to global node modules on your computer.

Then, you should use command line to create an application or package.

Finally, please open the project you just created, and start it.

Just like this:

```shell
$ npm i -g xueyan-typescript-cli
# ...
$ xueyan-typescript -h
# ...
$ xueyan-typescript create
# ...
$ cd $THE_PROJECT_YOU_JUST_CREATED
# ...
$ yarn start
# ...
# ok, you can start coding.
```

## API

- [create project](#create-project)
- [start project](#start-project)
- [build project](#build-project)
- [serve project](serve-project)
- [project config](project-config)

## create project

create application or package

`xueyan-typescript create [path]`  

For example:

```shell
$ xueyan-typescript create
√ project type · react-application
√ package name · demo
√ project path · D:\workspace\demo
√ package author name · xueyan
√ package author email · yang@xueyan.site
√ copy project template successfully
√ downloaded node modules successfully
√ initialized git repository successfully
```

## start project

start application (not package)

`xueyan-typescript start [path]`  

For example:

```shell
$ xueyan-typescript start
i ｢wds｣: Project is running at http://localhost:8080/
i ｢wds｣: webpack output is served from undefined
i ｢wds｣: Content not from webpack is served from D:\workspace\demo\public
i ｢wds｣: 404s will fallback to /index.html
i ｢wdm｣: wait until bundle finished: /
i ｢wdm｣: Compiled successfully.
```

## build project

build application or package

`xueyan-typescript build [path] [-w, --watch]`  

For example:

```shell
$ xueyan-typescript build
√ xueyan-typescript-cli builded successfully!
```

watch option can only be used for building packages.

```shell
$ xueyan-typescript build --watch
√ xueyan-typescript-cli builded successfully!
_
```

## serve project

run application by http server (not package)

`xueyan-typescript serve [path]`  

```shell
$ xueyan-typescript serve
[00:00:00.238 suc] demo listening on http://127.0.0.1:443!
_
```

## project config

xueyan-typescript application or package config file is **xueyan.json**.

please see **xueyan.json** config file in project root path.

### react-application config

```ts
interface ReactApplicationConfig {
  type: 'react-application'
  /** <http://expressjs.com/en/4x/api.html#app.listen> */
  startPort?: number
  /** <http://expressjs.com/en/4x/api.html#app.listen> */
  servePort?: number
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
