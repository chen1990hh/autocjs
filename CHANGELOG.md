## v1.0.0 pre-release

date: 2017-02-05

这是一个大版本更新，新版本将不再兼容之前的版本，建议所有用户更新到最新版本。

changes:

* 新增 chrome 浏览器滚动条样式，是界面在 Chrome 下看起来更美观；
* 更新 API 文档：
  * 调整了布局结构；
  * 新增了 Examples；
  * 进一步完善了 API 文档； 
* 完善了 autoc.js 源代码中的注释； 
* 修复 reload() 方法无法正确运行的 BUG；
* 移除了 prefix 配置参数；
* 变更了部分配置参数的名称：
  * isAnchorsOnly （新）—— onlyAnchors（旧）；
  * hasDirectoryInArticle（新）—— showTocInArticle（旧）；
  * hasCodeAtHeadings（新）—— showTocInArticle（旧）；
  * HEADER（新）—— TITLE（旧）；
  * FOOTER（新）—— BAR（旧）；
  * SWITCHER（新）—— SWITCH（旧）；
  * CHAPTERS（新）—— LIST（旧）；
  * SUBJECTS（新）—— SUB_LIST（旧）；
  * CHAPTER（新）—— ITEM（旧）；
  * TEXT（新）—— LINK（旧）；
  * CODE（新）—— CHAPTER（旧）；
* 变更了部分方法名称：
  * getFormattedChapters（新）—— getChaptersDataList（旧）；
  * renderArticleDirectory（新）—— renderTOCInArticle（旧）；
  * renderHeadingChapterCode（新）—— renderAnchorIndex（旧）；
  * renderSidebarDirectory（新）—— renderTOC（旧）；
* 将部分私有方法调整为共有方法；
  * initProps（新）—— _init（旧）；
  * attachEvents（新）—— _attachEvents（旧）；
  * onHeadingMouseEnter（新）—— _onAutocJSAnchorMouseEnter（旧）；
  * onHeadingMouseLeave（新）—— _onAutocJSAnchorMouseLeave（旧）；
  * onSwitcherClick（新）—— _onSwitchClick（旧）；
  * onTopClick（新）—— _onTopClick（旧）；
  * onSidebarChapterClick（新）—— _onChapterClick（旧）；
  * onOverlayClick（新）—— _onOverlayClick（旧）；
  * onWindowResize（新）—— onWindowResize（旧）；
* 将部分共有方法方法调整为私有方法：
  * getChapters（新）—— getArticleChapters（旧）；
  * getAnchors（新）—— getArticleAnchors（旧）；
  * getList（新）—— getChpatersDataList（旧）；
  * getPidByDiffer（新）—— _getPidByDiffer（旧）；
* 新增 5 公共方法：
  * headings；
  * list；
  * getArticleHeadings；
  * destroy；
  * onArticleChapterClick；
* 新增 6 个静态方法：  
  * AutocJS.stripScripts；
  * AutocJS.encodeHTML；
  * AutocJS.decodeHTML；
  * AutocJS.safetyHTML；
  * AutocJS.template；
  * AutocJS.guid；


## v0.2.3:

date: 2017-01-23

changes:

* 更新 css 样式；
* 新增 csslint 检测和 jslint 检测；


## v0.2.2:

date: 2017-01-23

changes:

* 修复 scrollTo 方法的 Firefox　兼容问题；
* 修复 jQuery 插件调用方式配置 article 参数 BUG 的修复；
* 更新 API 文档；
* 更新 render 方法，更新了绘制需要处理的逻辑；
* 更新 reload 方法，更具新的渲染界面逻辑做对应调整；
* 更新 renderChapters 方法，使其可以生成菜单的索引导航和文章内容的索引导航；
* 新增 showTocInArticle 配置，是否在文章中显示段落索引数据；
* 新增 showIndexAtAnchors 配置，是否在文章标题中显示段落索引；
* 新增 data.list　数据，格式化后 chapters 数据，以便生成树结构数据；
* 新增 renderTocInArticle、renderToc、renderAnchorIndex、renderToc；


## v0.2.1:

date: 2017-01-20

changes:

* 重构 css 代码；
* 更新 API 文档；
* 修复 renderChapters 方法下获取 SUB_LIST 模版的 BUG（之前获取的模版是固定的，而不是用户配置的 SUB_LIST）；
* 移除原来 window 对象下的 autoc 方法；
* attachEvents 转为私有方法 _attachEvents；
* renderLinks 更名为 renderAnchors；
* 新增 isAnimateScroll 配置，实现配置锚点跳转或者动画滚动跳转定位；
* 新增 scrollTo 方法，实现页面动画滚动定位；
* 新增 onlyAnchors 配置，onlyAnchors 为 ture，则 AutocJS 的行为和 AnchorJS 一样。为 false， 则会出现导航菜单；


## v0.2.0:

date: 2017-01-19

changes:

* 重构 js 代码；
* 更新 API 文档；
* 修复 getPidByDiffer 的 BUG；


## v0.1.5:

date: 2016-12-28

changes:

* 修复 _getPidByDiffer() 方法中 缺少 index 参数导致程序出错的问题；
* 整理 API 文档；
* 调整目录结构，将 API 整理到 docs 文件夹下，以便生成 github pages 文档；


## v0.1.4:

date: 2016-5-21

changes:

* 修复 getChapters() 方法中 this 关键字作用域出错的问题；


## v0.1.3:

date: 2016-04-23

changes:

* 添加新的方法（renderAnchorLinks\setChapters\reload）；
* 致敬 AnchorJS，给 H1~H6 标签添加类似 AnchorJS 的链接；
* 所有对外的方法都返回为单体对象，可以采用链式调用；


## v0.1.2:

date: 2016-04-08

changes:

* 重构 AutocJS，调整API结构，采用单体对象管理；
* Repositories contributed to NPM & bower；
* 修复 AMD 模块下文 BUG；


## v0.1.1:

date: 2016-04-08

changes:

* 支持 AMD 和 CMD 规范；
* 将 AutocJS 扩展成为一个 jQuery 插件；


## v0.1.0:

date: 2016-04-05

changes:

* AutocJS 程序的初始版本；