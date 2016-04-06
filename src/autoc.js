(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD (Register as an anonymous module)
        define(['jquery'], factory(global, $));
    }
    else {

        if (typeof define === 'function' && define.cmd) {
            // CMD (Register as an anonymous module)
            define('done', function (require, exports, module) {
                module.exports = factory(global, require('jquery'));
            });
        }
        else {

            if (typeof exports === 'object') {
                // Node/CommonJS
                module.exports = factory(global, require('jquery'));
            }
            else {
                // Browser globals
                factory(global, jQuery);
            }
        }
    }
}(typeof window !== "undefined" ? window : this, function (window, $) {
    'use strict';

    var CLS_SHOW = 'toc-show',
        CLS_HIDE = 'toc-hide',
        WRAP = '<div id="toc" class="toc"><h3 class="toc-anchors-title" id="toc-anchors-title">Table of Contents</h3></div>',
        HEAD = '<div class="toc-hd"></div>',
        TITLE = '<h2 class="toc-title" class="toc-title" title="Toggle Menu">&#926;</h2>',
        TOP = '<a class="toc-top" id="toc-top" href="#top">TOP</a>',
        BODY = '<nav id="toc-bd" class="toc-bd"></nav>',
        LIST = '<ol id="toc-list" class="toc-list"></ol>',
        SUB_LIST = '<ol class="toc-sub-list"></ol>',
        ITEM = '<li class="toc-item"></li>',
        LINK = '<a></a>',
        CHAPTER = '<em class="toc-chapter"></em>',
        OVERLAY = '<div id="toc-overlay" class="toc-overlay toc-hide"></div>',
        ANCHORS = 'h1,h2,h3,h4,h5,h6',
        PREFIX = 'anchor',
        $article = null,
        $anchors = null,
        $wrap = null,
        $head = null,
        $title = null,
        $top = null,
        $body = null,
        $list = null,
        $overlay = null,
        _uid = -1,
        defaults = {
            article: '#article',
            anchors: ANCHORS,
            prefix: PREFIX
        },
        attributes = {};

    /**
     * 生成唯一的 id
     *
     * @method guid
     * @param {String} [prefix] - 可选，默认生成数字ID，设置了 prefix 则生成字符串ID
     * @returns {Number|String}
     */
    function guid(prefix) {
        var id;

        _uid += 1;
        id = prefix ? prefix + '-' + _uid : _uid;

        return id;
    }

    /**
     * 配置参数
     *
     * @param {Object} config
     */
    function set(config) {
        if ($.isPlainObject(config)) {
            $.extend(attributes, config);
        }
    }

    /**
     * 初始化各个 DOM 节点
     * @private
     */
    function _init() {
        // 获得文章内容的 DOM 节点
        $article = $(attributes.article);

        // 获得文章中所有的标题
        $anchors = $article.find(attributes.anchors);

        // 初始化 DOM 部件
        $wrap = $(WRAP);
        $head = $(HEAD);
        $title = $(TITLE);
        $top = $(TOP);
        $body = $(BODY);
        $list = $(LIST);
        $overlay = $(OVERLAY);
    }

    /**
     * 初始化程序
     *
     * @param {Object} config - 配置信息
     * @param {String|HTMLElement} config.article
     * @param {String} [config.selector]
     * @param {String} [config.prefix]
     */
    function init(config) {

        set(defaults);
        set(config);

        _init();
    }

    /**
     * 获得文章的段落索引
     *
     * @returns {Array}
     */
    function getChapters() {
        var chapters = [],
            prevNum = 1,
            level = 0;

        // 获得目录索引信息
        $anchors.each(function (i, anchor) {
            var $anchor = $(anchor),
                curNum = parseInt($anchor[0].tagName.toUpperCase().replace(/[H]/ig, ''), 10),
                pid = -1;

            $anchor.attr('id', guid(attributes.prefix));

            // 1.（父标题，子标题）：当前标题的序号 > 前一个标题的序号
            if (curNum > prevNum) {
                level += 1;

                // 第一层级的 pid 是 -1
                if (level === 1) {
                    pid = -1;
                }
                else {
                    pid = i - 1;
                }
            } else {
                // 2.（同级标题，同级标题）
                // A. 当前标题的序号 === 前一个标题的序号
                // B. 当前标题的序号 < 前一个标题的序号 && 当前标题的序号 > 等级
                if (curNum === prevNum || (curNum < prevNum && curNum > level)) {

                    // H1 的层级肯定是 1
                    if (curNum === 1) {
                        level = 1;

                        pid = -1;
                    }
                    else {
                        pid = chapters[i - 1].pid;
                    }
                } else {
                    // 3.（子标题，父级标题）：当前标题的序号 < 前一个标题的序号
                    if (curNum <= level) {

                        // H1 的层级肯定是 1
                        if (curNum === 1) {
                            level = 1;
                        }
                        else {
                            level = level - (prevNum - curNum);
                        }

                        // 第一级的标题
                        if (level === 1) {
                            pid = -1
                        }
                        else {
                            // 最大只有5系的差距
                            // 虽然看上去差点，不过能工作啊
                            switch (prevNum - curNum) {
                                case 1:
                                    pid = chapters[chapters[i - 1].pid].pid;
                                    break;
                                case 2:
                                    pid = chapters[chapters[chapters[i - 1].pid].pid].pid;
                                    break;
                                case 3:
                                    pid = chapters[chapters[chapters[chapters[i - 1].pid].pid].pid].pid;
                                    break;
                                case 4:
                                    pid = chapters[chapters[chapters[chapters[chapters[i - 1].pid].pid].pid].pid].pid;
                                    break;
                                case 5:
                                    pid = chapters[chapters[chapters[chapters[chapters[chapters[i - 1].pid].pid].pid].pid].pid].pid;
                                    break;
                            }
                        }
                    }
                }
            }

            prevNum = curNum;

            chapters.push({
                id: i,
                level: level,
                text: $anchor.html(),
                value: $anchor.attr('id'),
                tag: anchor.tagName,
                pid: pid
            });
        });

        return chapters;
    }

    /**
     * 根据段落索引绘制完整的导航
     */
    function renderChapters() {
        var chapters = getChapters();

        $(chapters).each(function (i, chapter) {
            var $item = $(ITEM),
                $link = $(LINK),
                chapterText = '',
                chapterCount = 0,
                $chapter = $(CHAPTER),
                $sublist = $('#toc-list-' + chapter.pid);

            $link.attr({
                id: 'toc-link-' + chapter.id,
                href: '#' + chapter.value
            }).html(chapter.text);

            $item.attr({
                'id': 'toc-item-' + chapter.id,
                'title': chapter.text
            }).append($link);

            if (chapter.pid === -1) {
                $list.append($item);
                chapterCount = $item.index() + 1;
                chapterText = chapterCount;
            }
            else {
                if (!$sublist[0]) {
                    $sublist = $(SUB_LIST).attr('id', 'toc-list-' + chapter.pid);

                    $('#toc-item-' + chapter.pid).append($sublist);
                }

                $sublist.append($item);

                chapterCount = $item.index() + 1;
                chapterText = $sublist.parent().find('.toc-chapter').html() + '.' + chapterCount;
            }

            $chapter.attr('data-chapter', chapterCount).html(chapterText);
            $chapter.insertBefore($link);
        });
    }

    /**
     * 绘制界面
     */
    function render() {
        // 绘制head
        $head.append($title).append($top);

        // 绘制body
        $body.append($list);

        // 绘制完整的导航
        $wrap.append($head).append($body);

        // 将导航和遮罩层添加到页面
        $(document.body).append($wrap).append($overlay);

        renderChapters();

        updateLayout();
    }

    /**
     * 显示菜单
     */
    function show() {
        $overlay.removeClass(CLS_HIDE);

        $wrap.animate({
            left: 0
        }, 150, function () {
            $wrap.addClass(CLS_SHOW);
        });
    }

    /**
     * 隐藏菜单
     */
    function hide() {

        $wrap.animate({
            left: -300
        }, 150, function () {
            $overlay.addClass(CLS_HIDE);
            $wrap.removeClass(CLS_SHOW);
        });
    }

    /**
     * 隐藏/显示导航
     */
    function toggle() {

        if ($wrap.hasClass(CLS_SHOW)) {
            hide()
        }
        else {
            show();
        }
    }

    /**
     * 更新界面的高度
     */
    function updateLayout() {
        var wrapHeight = $wrap[0].offsetHeight,
            titleHeight = $('#toc-anchors-title')[0].offsetHeight;

        $body.height(wrapHeight - titleHeight);
    }

    /**
     * 给导航菜单的各个 DOM 节点绑定事件处理器
     */
    function attachEvents() {
        // 点击目录标题，隐藏/显示目录导航
        $title.on('click', toggle);

        // 点击TOP链接，返回页面顶部
        $top.on('click', hide);

        // 点击导航，定位文章，收起导航
        $list.delegate('li', 'click', hide);

        // 点击遮罩层，收起导航
        $overlay.on('click', hide);

        $(window).on('resize', updateLayout);
    }

    var AutocJS = function (config) {

        // 初始化
        init(config);

        // 只有正文的 DOM 存在才绘制导航
        if ($article[0]) {

            // 绘制界面
            render();

            // 绑定事件处理器
            attachEvents();
        }
    };

    window.autoc = AutocJS;

    return AutocJS;
}));