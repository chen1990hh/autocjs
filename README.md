# AutocJS
AutocJS - 为你的文章自动创建目录导航菜单。

## 创作的灵感
[AnchorJS](http://bryanbraun.github.io/anchorjs/) 是 AutocJS 的创作灵感。既然 AnchorJS 可创建标题的链接，为什么不直接给文章生成一个目录（Table of Contents）导航呢？

## What is AutocJS?
AutocJS 是一个专门用来给文章生成目录（Table of Contents）导航菜单的工具。AutocJS 会查找文章中的所有h1~h6的标签，并自动生成文章的目录导航菜单。

## Why AutocJS?
AnchorJS 对中文标题生成锚点支持的不好。即便是修改了 AnchorJS 中的正则表达式，生成的锚点是中文的也很奇怪。于是就自己编写了 AutocJS。如果你需要对中文支持的更好，如果你同时希望给文章添加目录导航，AutocJS 就是一个不错的选择。

## 调用方法
AutocJS 的调用很简单，只需要以下3步便可以轻松搞定。

### 第一步：引用 autoc.css
<pre class="code"><code>&lt;link type="text/css" rel="stylesheet" href="autoc.css"&gt;</code></pre>

