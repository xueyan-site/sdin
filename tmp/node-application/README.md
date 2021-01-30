# <%= package.name %>

<%= package.name %> 是一个Node应用。  
<%= package.name %> is a node application.  

本项目创建自 <%= package.author %>。  
The project created by <%= package.author %>.  

## 下载 Install

```bash
# 如果你使用的是NPM：
# if you use NPM: 
npm i <%= package.name %>

# 如果你使用的是Yarn：
# if you use Yarn: 
yarn add <%= package.name %>
```

## 示例 Example

```ts
import Switch from '<%= package.name %>'

<Switch value={state} onChange={state => setState(state)}/>
```
