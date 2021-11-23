# xueyan-typescript-cli

`xueyan-typescript-cli` is Typescript Application or Package Command Tool.  

- [xueyan-typescript-cli](#xueyan-typescript-cli)
  - [Why use it](#why-use-it)
  - [What are its highlights](#what-are-its-highlights)
  - [How to use it](#how-to-use-it)
  - [Command](#command)
    - [xt create](#xt-create)
    - [xt start](#xt-start)
    - [xt build](#xt-build)
    - [xt serve](#xt-serve)
  - [Config](#config)
    - [package](#package)
      - [package name](#package-name)
      - [package alias](#package-alias)
      - [package buildWeb](#package-buildweb)
      - [package buildNode](#package-buildnode)
      - [package buildTypes](#package-buildtypes)
      - [package useReact](#package-usereact)
      - [package useUglify](#package-useuglify)
    - [react-csr](#react-csr)
      - [react-csr name](#react-csr-name)
      - [react-csr alias](#react-csr-alias)
      - [react-csr path](#react-csr-path)
      - [react-csr index](#react-csr-index)
      - [react-csr error](#react-csr-error)
      - [react-csr page](#react-csr-page)
      - [react-csr module](#react-csr-module)
      - [react-csr module.externals](#react-csr-moduleexternals)
      - [react-csr module.babelIncludes](#react-csr-modulebabelincludes)
      - [react-csr module.babelExcludes](#react-csr-modulebabelexcludes)
      - [react-csr module.rules](#react-csr-modulerules)
      - [react-csr module.loaders](#react-csr-moduleloaders)
      - [react-csr serve](#react-csr-serve)
      - [react-csr serve.port](#react-csr-serveport)
      - [react-csr serve.proxies](#react-csr-serveproxies)
      - [react-csr start](#react-csr-start)
    - [react-csr-page](#react-csr-page-1)
      - [react-csr-page name](#react-csr-page-name)
      - [react-csr-page path](#react-csr-page-path)
      - [react-csr-page entry](#react-csr-page-entry)
      - [react-csr-page container](#react-csr-page-container)
      - [react-csr-page title](#react-csr-page-title)
      - [react-csr-page metas](#react-csr-page-metas)
      - [react-csr-page links](#react-csr-page-links)
      - [react-csr-page scripts](#react-csr-page-scripts)
      - [react-csr-page styles](#react-csr-page-styles)
      - [react-csr-page skeleton](#react-csr-page-skeleton)
  - [Develop](#develop)
  - [Appendix](#appendix)

## Why use it

I'm tired of all the repetitive actions, downloading many modules each time, configuring the packaging rules each time, reading the documentation on the web each time, and being afraid that I'm not doing all these things right. I want to do it in an easy way, once and for all.  

So, there it is.  

It integrates with many great tools, It doesn't require you to know the packaging rules, it doesn't require you to install many packages outside of your project each time, you just need to `yarn start` and `yarn build`.

## What are its highlights

- build based on `Webpack 5` and `gulp 4`
- server with `Koa 2` as core
- Using `Typescript` to coding
- Using `React` as web framework
- component level `Hot Reload`
- support config `CDN` scripts and styles
- Reasonable way to `split code`
- support develop these project:  
  - `command tools`
  - `node package`
  - `web package`
  - `react component`
  - `react application`

Small. the projects generated by it will not contain packages that are not used by the project (e.g. webpack, babel, etc.) and will not contain many configuration files (e.g. babelrc, eslintrc, etc.).  

Friendly. with few and simple commands, the console doesn't output a lot of distracting information, and the freshly generated project has the shape of a near-complete project.  

Completely. it currently meets the basic needs of the project, with four functions: create, develop, build, and serve, and later will have the ability to test, monitor, and tracking.  

## How to use it

You just need to remember a few commands: `xt create`, `xt start`, `xt build`, `xt serve`.  

Here is an example of creating a project and running it：

```shell
npm i -g xueyan-typescript-cli
xt create
cd $the_project_you_just_created
yarn start
```

## Command

### xt create

`xt create [path]`  

Create application or package.  

There are two project types to choose from, `react-csr` and `package`.  

If you want to write package (e.g. node package, web package, react component, command tools, etc.), choose type package.  

If you want to develop web application, choose type react-csr.  

### xt start

`xt start`  

Build and listen to source files of project.  

If the source code changes, it will be recompiled.  

### xt build

`xt build`  

Build application or package.  

### xt serve

`xt serve`  

Run application by http server.  

Only for application, you cannot run package with it.  

## Config

The file `project.js` in the root of the project is the project's configuration file, and we can change the configuration file to achieve the effect we want.  

### package

By default, both web-side and node-side code will be built.  

#### package name

`name: string = <package.json name>`

Project name, Chinese and English are both available, if null, the name field in package.json is used instead

#### package alias

`alias: { [prop:string]: string } = {}`

Module alias name

```ts
const alias = {
  utl: "src/utl",
  types: "src/types.ts"
}
```

#### package buildWeb

`buildWeb: boolean = true`

Build out scripts for use on web side

#### package buildNode

`buildNode: boolean = true`

Build out the script for use on node side

#### package buildTypes

`buildTypes: boolean = true`

Build out the typescript definition file

#### package useReact

`useReact: boolean = false`

Enable react (you need to turn it on when developing react components)

#### package useUglify

`useUglify: boolean = false`

Compress and obfuscate code

### react-csr

Client-side rendering of react application.  

It is multi-page mode.  

#### react-csr name

`name: string = <package.json name>`

Project name, Chinese and English are both available, if null, the name field in package.json is used instead

#### react-csr alias

`alias: { [prop:string]: string } = {}`

Module alias name

```ts
const alias = {
  utl: "src/utl",
  types: "src/types.ts"
}
```

#### react-csr path

`path: string = '/'`

Public path in all of project page url

#### react-csr index

`index?: string`

Root page of project (it is path).  

#### react-csr error

`error?: string`

Error page of project (it is path)

#### react-csr page

`page?: Partial<ReactCSRPageConfig>`

Default values for page configuration.  

See [react-csr-page](#react-csr-page-1) for detailed fields.  

#### react-csr module

`module?: Partial<ReactCSRModuleConfig>`

#### react-csr module.externals

`{ [prop: string]: string } = {}`

<https://webpack.js.org/configuration/externals/>

webpack module externals

#### react-csr module.babelIncludes

`babelIncludes: RuleSetCondition[] = []`

At compile time, specify the modules that the babel loader needs to process.  

#### react-csr module.babelExcludes

`babelExcludes: RuleSetCondition[] = []`

At compile time, specify the modules that the babel loader does not need to process.  

#### react-csr module.rules

```ts
interface Rules {
  row?: Partial<RuleSetRule>
  font?: Partial<RuleSetRule>
  image?: Partial<RuleSetRule>
  audio?: Partial<RuleSetRule>
  video?: Partial<RuleSetRule>
}
```

RuleSetRule: <https://webpack.js.org/configuration/module/#rule>  

Modify the compilation webpack rules of modules (only some values are allowed to be modified).  

#### react-csr module.loaders

`loaders: RuleSetRule[] = []`

RuleSetRule: <https://webpack.js.org/configuration/module/#rule>  

Customizing the compilation webpack rules of modules.  

#### react-csr serve

`serve?: Partial<ReactCSRServeConfig>`

#### react-csr serve.port

`port: number = 443`

The port that server listens on.  

#### react-csr serve.proxies

`proxies: ProxyOptions[] = []`

ProxyOptions: <https://github.com/edorivai/koa-proxy>

server proxy config

#### react-csr start

`start?: Partial<ReactCSRStartConfig>`

extends react CSR serve config.  

server default port is 8080.  

### react-csr-page

The file `page.js` in the root of the project page is the page's configuration file.  

#### react-csr-page name

`name: string = <page folder name>`

Page name

#### react-csr-page path
  
`path: string = <page folder name>`

Page url suffix path

#### react-csr-page entry

`entry: string = 'index.tsx'`

Entry component (file path).

#### react-csr-page container

`container?: string`

Container component (file path).

#### react-csr-page title

`title: string = <page name and project name`

Title of HTML

#### react-csr-page metas

`metas: NodeAttrs[] = []`

Meta list of HTML

#### react-csr-page links

`links: NodeAttrs[] = []`

Link list of HTML

#### react-csr-page scripts

`scripts: NodeAttrs[] = []`

Script list of HTML

#### react-csr-page styles

`styles: NodeAttrs[] = []`

Style list of HTML

#### react-csr-page skeleton

`skeleton?: (page: ReactCSRPage) => string`

HTML skeleton renderer

## Develop

Please make sure that `Node` and `NPM` are installed on your computer, and `xueyan-typescript-cli` is installed globally. After switching current work path to this project root in CMD, you can run command `yarn start`.

## Appendix

author - xueyan <yang@xueyan.site>  
builder - [xueyan-typescript-cli](https://github.com/xueyan-site/xueyan-typescript-cli)  
