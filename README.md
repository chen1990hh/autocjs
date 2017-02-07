# AutocJS v1.0.1


## Idea
[AnchorJS](http://bryanbraun.github.io/anchorjs/) 是 AutocJS 的创作灵感。既然 AnchorJS 可创建标题的链接，为什么不直接给文章生成一个目录（Table of Contents）导航呢？ 于是就有了 AutocJS。


## What is AutocJS?
AutocJS 是一个专门用来生成文章目录（Table of Contents）导航的工具。AutocJS 会查找文章指定区域中的所有 h1~h6 的标签，并自动分析文章的层次结构，生成文章的目录导航（独立的侧边栏菜单，或者在文章的开始处生成文章目录）。


## Why AutocJS?
AnchorJS 由于是国外的程序员开发的，所以对中文支持不好，无法给中文标题生成锚点。而 AutocJS 即支持英文也支持中文。AutocJS 在拥有 AnchorJS 的基础功能同时，还可以自动分析文章的层次结构，生成文章的目录导航。

## Features

* 支持 AMD 和 CMD 规范；
* 可以作为独立模块使用，也可以作为 jQuery 插件使用；
* 支持中文和英文（标题文字）；
* 界面简洁大方；
* 拥有 AnchorJS 的基础功能；
* 即支持生成独立文章目录导航菜单，又可以直接在文章中生成目录导航；
* 可直接在段落标题上显示段落层级索引值；
* 配置灵活，丰富，让你随心所欲掌控 AutocJS；
   

## Install

### npm install
```
npm install autocjs
```

### bower install
```
bower install autocjs
```


## Usage

### Use as a CommonJS/AMD/CMD Module

```js
var AutocJS = require('autocjs');

new AutocJS({
    article: '#article'
});
```

### Use as a jQuery plugin

```js
$('#article').autoc({
    title: 'AutocJS v0.2.0'
});
```

### Use as an independent Module

```js
new AutocJS({
    article: '#article',
    title: 'AutocJS v0.2.0'
});
```


## API Documentation

This task primarily delegates to [AutocJS][], so please consider the [AutocJS documentation][] as required reading for advanced configuration.

[AutocJS]: https://github.com/yaohaixiao/AutocJS
[AutocJS documentation]: http://yaohaixiao.github.io/AutocJS/

### Options

#### article
Type: `String` `HTMLElement`  
Default: `''`

必选，用来指定页面中显示文章正文的 DOM 节点或者 ID 选择器。如果没有指定它，则程序将不会执行。[查看详情](http://yaohaixiao.github.io/AutocJS/api/options.htm#article)

#### selector
Type: `String`  
Default: `'h1,h2,h3,h4,h5,h6'`

可选，用来指定 <a href="options.htm#article">article</a> 节点下，要生成导航的标题标签的选择器。[查看详情](http://yaohaixiao.github.io/AutocJS/api/options.htm#selector)

#### title
Type: `String`  
Default: `'Table of Contents'`

可选，用来指定 AutocJS 自动创建的文章导读索引导航菜单的标题文字。[查看详情](http://yaohaixiao.github.io/AutocJS/api/options.htm#title)

#### isAnchorsOnly
Type: `Boolean`  
Default: `false`

可选，用来指定是否只创建标题链接。[查看详情](http://yaohaixiao.github.io/AutocJS/api/options.htm#isAnchorsOnly)

#### isAnimateScroll
Type: `Boolean`  
Default: `true`

可选，用来指定在点击段落索引导航链接时，是使用动画滚动定位，还是使用默认的锚点链接行为。[查看详情](http://yaohaixiao.github.io/AutocJS/api/options.htm#isAnimateScroll)

#### hasDirectoryInArticle
Type: `Boolean`  
Default: `false`

可选，用来指定是否在文章（开始位置）中创建目录导航。[查看详情](http://yaohaixiao.github.io/AutocJS/api/options.htm#hasDirectoryInArticle)

#### hasChapterCodeAtHeadings
Type: `Boolean`  
Default: `false`

可选，用来指定是否在文章标题中显示该标题的段落索引编号。[查看详情](http://yaohaixiao.github.io/AutocJS/api/options.htm#hasChapterCodeAtHeadings)

     
### Properties

#### defaults
Type: `Objects`

静态属性，存储的是 AutocJS 对象默认配置选项。[查看详情](http://yaohaixiao.github.io/AutocJS/api/properties.htm#defaults)

#### version
Type: `String`

存储的是 AutocJS 当前的版本号。[查看详情](http://yaohaixiao.github.io/AutocJS/api/properties.htm#version)


### Methods

* [init](http://yaohaixiao.github.io/AutocJS/api/methods.htm#init) - 初始化程序
* [initElements](http://yaohaixiao.github.io/AutocJS/api/methods.htm#initElements) - 初始化 elements 属性（AutocJS 对象相关 DOM 元素）
* [initData](http://yaohaixiao.github.io/AutocJS/api/methods.htm#initData) - 初始化 data 属性（文章段落章节数据）
* [set](http://yaohaixiao.github.io/AutocJS/api/methods.htm#set) - 设置 attributes 属性
* [get](http://yaohaixiao.github.io/AutocJS/api/methods.htm#get) - 返回某个 attributes 属性
* [article](http://yaohaixiao.github.io/AutocJS/api/methods.htm#article) - 返回页面文章正文的容器 DOM 元素
* [headings](http://yaohaixiao.github.io/AutocJS/api/methods.htm#headings) - 返回 article 中 selector 匹配的所有（标题） DOM 元素
* [chapters](http://yaohaixiao.github.io/AutocJS/api/methods.htm#chapters) - 设置 data 属性或者返回 headings() 方法分析所得的文章段落数据
* [anchors](http://yaohaixiao.github.io/AutocJS/api/methods.htm#anchors) - 返回根据 headings() 方法对应自动创建的标题锚点链接 DOM 元素
* [dom](http://yaohaixiao.github.io/AutocJS/api/methods.htm#dom) - 返回 elements 属性
* [list](http://yaohaixiao.github.io/AutocJS/api/methods.htm#list) - 返回 data 属性（文章段落数据）按 pid 分组的二维数组
* [getChapterIndex](http://yaohaixiao.github.io/AutocJS/api/methods.htm#getChapterIndex) - 返回 chapter 在 data.list 中对应段落层次位置索引值
* [render](http://yaohaixiao.github.io/AutocJS/api/methods.htm#render) - 绘制 UI 界面
* [renderArticleDirectory](http://yaohaixiao.github.io/AutocJS/api/methods.htm#renderArticleDirectory) - 在文章开始处绘制目录导航
* [renderAnchors](http://yaohaixiao.github.io/AutocJS/api/methods.htm#renderAnchors) - 绘制标题锚点链接和标题段落章节索引代码
* [renderHeadingChapterCode](http://yaohaixiao.github.io/AutocJS/api/methods.htm#renderHeadingChapterCode) - 在文章标题中绘制其对应的段落章节索引编码
* [renderSidebarDirectory](http://yaohaixiao.github.io/AutocJS/api/methods.htm#renderSidebarDirectory) - 绘制侧边栏的目录导航菜单
* [renderSidebarOutline](http://yaohaixiao.github.io/AutocJS/api/methods.htm#renderSidebarOutline) - 绘制侧边栏菜单的框架
* [renderChapters](http://yaohaixiao.github.io/AutocJS/api/methods.htm#renderChapters) - 绘制文章章节索引
* [show](http://yaohaixiao.github.io/AutocJS/api/methods.htm#show) - 展开侧边栏菜单
* [hide](http://yaohaixiao.github.io/AutocJS/api/methods.htm#hide) - 收起侧边栏菜单
* [toggle](http://yaohaixiao.github.io/AutocJS/api/methods.htm#toggle) - 收起/展开侧边栏菜单
* [updateLayout](http://yaohaixiao.github.io/AutocJS/api/methods.htm#updateLayout) - 根据当前窗口高度更新侧边栏菜单界面高度
* [scrollTo](http://yaohaixiao.github.io/AutocJS/api/methods.htm#scrollTo) - 将窗口的滚动条滚动到指定 top 值的位置
* [destroy](http://yaohaixiao.github.io/AutocJS/api/methods.htm#destroy) - 移除所有绘制的 DOM 节点，并移除绑定的事件处理器


## Examples

#### Customize selector

```js
new AutocJS({
    article: '#container',
    // 只收集文章中的 h2　标题标签
    selector: 'h2'
});
```

演示地址：[http://yaohaixiao.github.io/AutocJS/examples/customize-selector.htm](http://yaohaixiao.github.io/AutocJS/examples/customize-selector.htm)

#### Customize title

```js
new AutocJS({
    article: '#container',
    title: 'Customize Title'
});
```

演示地址：[http://yaohaixiao.github.io/AutocJS/examples/customize-title.htm](http://yaohaixiao.github.io/AutocJS/examples/customize-title.htm)

#### Create anchors only

```js
new AutocJS({
    article: '#container',
    isAnchorsOnly: true
});
```

演示地址：[http://yaohaixiao.github.io/AutocJS/examples/create-anchors-only.htm](http://yaohaixiao.github.io/AutocJS/examples/create-anchors-only.htm)

#### Positioning behavior

```js
new AutocJS({
    article: '#container',
    // 不配置 isAnimateScroll 或者设置为 true 则是默认的动画滚动定位
    isAnimateScroll: false
});
```

演示地址：[http://yaohaixiao.github.io/AutocJS/examples/positioning-behavior.htm](http://yaohaixiao.github.io/AutocJS/examples/positioning-behavior.htm)

#### Create directory navigation in the article

```js
new AutocJS({
    article: '#container',
    // 不配置 hasDirectoryInArticle 或者设置为 false，则不会在文章开始位置显示目录导航
    hasDirectoryInArticle: true,
    // 通常这个时候就不需要侧边栏的导航菜单了，当然你也可以两个都要（isAnchorsOnly: false 即可）。
    onlyAnchors: true
});
```

演示地址：[http://yaohaixiao.github.io/AutocJS/examples/create-directory-navigation-in-the-article.htm](http://yaohaixiao.github.io/AutocJS/examples/create-directory-navigation-in-the-article.htm)

#### Has chapter code at the headings

```js
new AutocJS({
    article: '#container',
    // 不配置 hasCodeAtHeadings 或者设置为 false，则不会在文章中的标题上显示段落章节索引编码
    hasCodeAtHeadings: true
});
```

演示地址：[http://yaohaixiao.github.io/AutocJS/examples/has-chapter-code-at-the-headings.htm](http://yaohaixiao.github.io/AutocJS/examples/has-chapter-code-at-the-headings.htm)


## Release History

See the [CHANGELOG](https://github.com/yaohaixiao/AutocJS/blob/master/CHANGELOG.md).


## License

Code licensed under [MIT License](http://opensource.org/licenses/mit-license.html). 

API Documentation licensed under [CC BY 3.0](http://creativecommons.org/licenses/by/3.0/).