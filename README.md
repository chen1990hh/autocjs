# AutocJS v0.2.0

## Idea
[AnchorJS](http://bryanbraun.github.io/anchorjs/) 是 AutocJS 的创作灵感。既然 AnchorJS 可创建标题的链接，为什么不直接给文章生成一个目录（Table of Contents）导航呢？ 于是就有了AutocJS。


## What is AutocJS?
AutocJS 是一个专门用来给文章生成目录（Table of Contents）导航菜单的工具。AutocJS 会查找文章指定区域中的所有h1~h6的标签，并自动生成文章的目录导航菜单。


## Why AutocJS?
AnchorJS 由于是国外的程序员开发的，所以对中文支持不好，无法给中文标题生成锚点。AutocJS 就是一个即支持英文也支持中文的解决方案。


### AutocJS 的特点

  * 全面支持中文和英文
  * 简洁大方的界面，采用绝对应为导航，不会破坏页面的美观
  * 弹性的界面布局，可以根据不同的窗口高度，自动调节菜单布局
  * 精确的章节统计，文章层次结构一目了然
  * 支持 AMD 和 CMD 规范
  * 可以作为 jQuery 插件使用


## Examples
演示地址：[http://yaohaixiao.github.io/AutocJS/](http://yaohaixiao.github.io/AutocJS/)


## Install

### npm install
```
npm install AutocJS
```

### bower install
```
bower install AutocJS
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

### Use as an independent Object

```js
new AutocJS({
    article: '#article',
    title: 'AutocJS v0.2.0'
});
```


## API Documentation

### Configuration Options

```js
new AutocJS({
    // 页面正文容器的 DOM 节点或者检点的 ID 选择器
    article: '#article',
    // 页面正文中要收集的文章标点的选择器
    selector: 'h1,h2,h3,h4,h5,h6',
    // 文章标题自动添加链接的 id 的前缀
    prefix: 'anchor',
    // 正文要收集的每个标题自动生成的锚点链接 HTML 模板
    ANCHOR_LINK: '<a aria-hidden="true" class="toc-anchor-link"></a>',
    // AutocJS 菜单的标题文字
    title: 'Table of Contents',
    // AutocJS 菜单的根节点的 HTML 模板
    WRAP: '<div id="toc" class="toc toc-hide" aria-hidden="true"></div>',
    // AutocJS 菜单的标题栏的 HTML 模板
    TITLE: '<h3 class="toc-title" id="toc-title" aria-hidden="true">{title}</h3>',
    // AutocJS 菜单的伸缩按钮框的 HTML 模板
    BAR: '<div class="toc-bar" aria-hidden="true"></div>',
    // AutocJS 菜单的显示隐藏按钮的 HTML 模板
    SWITCH: '<h2 class="toc-switch" class="toc-switch" title="Toggle Menu" aria-hidden="true">Ξ</h2>',
    // AutocJS 菜单的返回顶部按钮的 HTML 模板
    TOP: '<a class="toc-top" id="toc-top" href="#top" aria-hidden="true">TOP</a>',
    // AutocJS 菜单的主内容节点的 HTML 模板
    BODY: '<nav id="toc-bd" class="toc-bd" aria-hidden="true"></nav>',
    // AutocJS 菜单的索引列表的 HTML 模板
    LIST: '<ol id="toc-list" class="toc-list" aria-hidden="true"></ol>',
    // AutocJS 菜单的子索引列表的 HTML 模板
    SUB_LIST: '<ol class="toc-sub-list" aria-hidden="true"></ol>',
    // AutocJS 菜单的子索引列表的 HTML 模板
    ITEM: '<li class="toc-item" aria-hidden="true"></li>',
    // AutocJS 菜单的引列表的标题链接 HTML 模板
    LINK: '<a aria-hidden="true"></a>',
    // AutocJS 菜单的引列表的标题文字的 HTML 模板
    CHAPTER: '<em class="toc-chapter" aria-hidden="true"></em>',
    // AutocJS 菜单展开时遮罩层的 HTML 模板
    OVERLAY: '<div id="toc-overlay" class="toc-overlay toc-hide" aria-hidden="true"></div>'
});
```

### Attributes

* article
* selector
* prefix
* ANCHOR_LINK
* title
* WRAP
* TITLE
* BAR
* SWITCH
* TOP
* BODY
* LIST
* SUB_LIST
* ITEM
* LINK
* CHAPTER
* OVERLAY
     
### Properties
* attributes - AutocJS 对象设置的配置信息
* elements - AutocJS 对象的所有 HTML 节点的集合
* data - AutocJS 对象的数据，包括 anchors 和 chapters
* defaults - （静态属性）AutocJS 对象默认的配置信息

### Methods

* [init( options )](http://yaohaixiao.github.io/AutocJS/methods.htm#init)
* [set( config )](http://yaohaixiao.github.io/AutocJS/methods.htm#set)
* [get( prop )](http://yaohaixiao.github.io/AutocJS/methods.htm#get)
* [anchors( data )](http://yaohaixiao.github.io/AutocJS/methods.htm#anchors)
* [chapters( data )](http://yaohaixiao.github.io/AutocJS/methods.htm#chapters)
* [getArticleAnchors( )](http://yaohaixiao.github.io/AutocJS/methods.htm#getArticleAnchors)
* [getArticleChapters( )](http://yaohaixiao.github.io/AutocJS/methods.htm#getArticleChapters)
* [getPidByDiffer( )](http://yaohaixiao.github.io/AutocJS/methods.htm#getPidByDiffer)
* [render( )](http://yaohaixiao.github.io/AutocJS/methods.htm#render)
* [renderLinks( )](http://yaohaixiao.github.io/AutocJS/methods.htm#renderLinks)
* [renderElements( )](http://yaohaixiao.github.io/AutocJS/methods.htm#renderElements)
* [renderChapters( )](http://yaohaixiao.github.io/AutocJS/methods.htm#renderChapters)
* [show( )](http://yaohaixiao.github.io/AutocJS/methods.htm#show)
* [hide( )](http://yaohaixiao.github.io/AutocJS/methods.htm#hide)
* [toggle( )](http://yaohaixiao.github.io/AutocJS/methods.htm#toggle)
* [updateLayout( )](http://yaohaixiao.github.io/AutocJS/methods.htm#updateLayout)
* [reload( options )](http://yaohaixiao.github.io/AutocJS/methods.htm#reload)


## Release History

See the [CHANGELOG](https://www.github.com/yaohaixiao/AutocJS/CHANGELOG.md)</a>.


## License

Copyright (c) 2016 [Yaohaixiao](http://www.yaohaixiao.com/)

Licensed under the MIT License
