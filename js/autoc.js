(function ($) {
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
        $article = null,
        $anchors = null,
        $wrap = null,
        $head = null,
        $title = null,
        $top = null,
        $body = null,
        $list = null,
        $overlay = null,
        _uid = -1;

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
     * 初始化程序
     *
     * @param {String|HTMLElement} article - 文章正文的节点的 ID
     */
    function init(article){
        // 获得文章内容的 DOM 节点
        $article = $(article);

        // 获得文章中所有的标题
        $anchors = $article.find(ANCHORS);

        // 初始化 DOM 部件
        $wrap = $(WRAP);
        $head = $(HEAD);
        $title = $(TITLE);
        $top = $(TOP);
        $body = $(BODY);
        $list = $(LIST);
        $overlay = $(OVERLAY);
    }

    function getChapters(){
        var chapters = [],
            prevNum = 1,
            level = 0;

        // 获得目录索引信息
        $anchors.each(function(i, anchor){
            var $anchor = $(anchor),
                curNum = $anchor[0].tagName.toUpperCase().replace(/[H]/ig,''),
                pid = -1;

            $anchor.attr('id', guid('anchor'));

            // 1.（父标题，子标题）：当前标题的序号 > 前一个标题的序号
            if (curNum > prevNum) {
                level += 1;

                if(level===1){
                    pid = -1;
                }
                else{
                    pid = i - 1;
                }
            } else {
                // 2.（同级标题，同级标题），当前标题的序号 === 前一个标题的序号
                if (curNum === prevNum || (curNum <= prevNum && curNum>level)) {
                    level = level;

                    pid = chapters[i - 1].pid;
                } else {
                    // 3.（子标题，父级标题）：当前标题的序号 < 前一个标题的序号
                    if (curNum <= level) {
                        level = level - (prevNum - curNum);

                        if (level === 1) {
                            pid = -1
                        }
                        else {
                            switch(prevNum - curNum){
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
                level:level,
                text: $anchor.html(),
                value: $anchor.attr('id'),
                tag: anchor.tagName,
                pid: pid
            });
        });

        return chapters;
    }

    /**
     * 绘制导航索引
     */
    function renderChapters(){
        var chapters = getChapters();

        $(chapters).each(function(i, chapter) {
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

            $item.attr('id', 'toc-item-' + chapter.id).append($link);

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
    function render(){
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

    // 显示目录导航
    function show() {
        $overlay.removeClass(CLS_HIDE);

        $wrap.animate({
            left: 0
        }, 150, function () {
            $wrap.addClass(CLS_SHOW);
        });
    }

    // 隐藏目录导航
    function hide() {

        $wrap.animate({
            left: -300
        }, 150, function () {
            $overlay.addClass(CLS_HIDE);
            $wrap.removeClass(CLS_SHOW);
        });
    }

    // 隐藏/显示导航
    function toggle() {

        if ($wrap.hasClass(CLS_SHOW)) {
            hide()
        }
        else {
            show();
        }
    }

    function updateLayout(){
        var wrapHeight = $wrap[0].offsetHeight,
            titleHeight = $('#toc-anchors-title')[0].offsetHeight;

        $body.height(wrapHeight-titleHeight);
    }

    // 给导航菜单的各个 DOM 节点绑定事件处理器
    function attachEvents(){
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

    var autoc = function (article) {

        // 初始化
        init(article);

        // 绘制界面
        render();

        // 绑定事件处理器
        attachEvents();
    };

    window.autoc = autoc;
})(jQuery);