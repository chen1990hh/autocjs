# AutocJS
AutocJS - 为你的文章自动创建目录导航菜单。

[AnchorJS](http://bryanbraun.github.io/anchorjs/) 是 AutocJS 的创作灵感。既然 AnchorJS 可创建标题的链接，为什么不直接给文章生成一个目录（Table of Contents）导航呢？

## What is AutocJS?
AutocJS 是一个专门用来给文章生成目录（Table of Contents）导航菜单的工具。AutocJS 会查找文章中的所有h1~h6的标签，并自动生成文章的目录导航菜单。

## Why AutocJS?
AnchorJS 由于是国外的程序员开发的，所以对中文支持不好，无法给中文标题生成锚点。AutocJS 就是一个即支持英文也支持中文的解决方案。

### AutocJS 的特点

  * 全面支持中文和英文
  * 简洁大方的界面，采用绝对应为导航，不会破坏页面的美观
  * 弹性的界面布局，可以根据不同的窗口高度，自动调节菜单布局
  * 精确的章节统计，文章层次结构一目了然

## DEMO
演示地址：[http://www.yaohaixiao.com/github/autocjs/index.html](http://www.yaohaixiao.com/github/autocjs/index.html)

    <h2>API Documentation</h2>
    <p>AutoJS 目前只提供一个方法 <code>autoc()</code>，简单易用。具体的 API 说明如下：</p>
    <h3>语法</h3>
    <pre class="code"><code>autoc(config);</code></pre>
    <h3>参数说明</h3>
    <ul>
        <li>
            <strong>config（必填）</strong>
            <ul>
                <li>数据类型：Object；</li>
                <li>说明：程序的配置参数对象；</li>
            </ul>
        </li>
        <li>
            <strong>config.article（必填）</strong>
            <ul>
                <li>数据类型：String | HTMLElement；</li>
                <li>说明：要生成文章索引的目标 DOM id 字符串或者 HTML DOM 元素；</li>
            </ul>
        </li>
        <li>
            <strong>config.anchors（可选）</strong>
            <ul>
                <li>数据类型：String；</li>
                <li>说明：希望生成文章导航的标题（h1~h6）选择器；</li>
                <li>默认值："h1,h2,h3,h4,h5,h6"；</li>
            </ul>
        </li>
        <li>
            <strong>config.prefix</strong>
            <ul>
                <li>数据类型：String；</li>
                <li>说明：config.anchors（h1~h6） 生成锚点的 ID 前缀；</li>
                <li>默认值："anchor"；</li>
            </ul>
        </li>
    </ul>
    <h3>调用方法</h3>
    <p>AutocJS 的调用很简单，只需要以下3步便可以轻松搞定。</p>
    <h4>第一步：引用 CSS 样式</h4>
    <pre class="code"><code>&lt;link type="text/css" rel="stylesheet" href="autoc.css"&gt;</code></pre>
    <h4>第二步：引用 JS 脚本</h4>
    <pre class="code"><code>// AutocJS 依赖 jQuery（稍后会开发没有任何依赖的版本）
&lt;script type="text/javascript" src="jquery.js"&gt;&lt;/script&gt;
// 调用 autoc.js
&lt;script type="text/javascript" src="autoc.js"&gt;&lt;/script&gt;</code></pre>
    <h4>第三步：调用 autoc() 方法</h4>
    <p>autoc() 方法接受 3 个参数，具体的调用方法如下：</p>
    <h5>指定文章内容的 DOM 节点</h5>
    <pre class="code"><code>// 最基础的方法，只需要指定文章内容的 DOM 节点的　id
autoc({
    article: '#article'
});</code></pre>
    <h5>指定要记录的标题</h5>
    <pre class="code"><code>// 索引只会提取文章 h3 和 h4 的标题
autoc({
    article: '#article',
    anchors: 'h3,h4'
});</code></pre>
    <h5>指定标题锚点的 id 的前缀</h5>
    <pre class="code"><code>// h3,h4 的锚点会是 p-1, p-2
autoc({
    article: '#article',
    anchors: 'h3,h4',
    prefix: 'p'
});</code></pre>

## License

Available via the MIT license.
