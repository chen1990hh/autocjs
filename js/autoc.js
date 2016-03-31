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

    /**
     * 绘制界面
     */
    function render(){
        var levels = [],
            prevNum = 1,
            level = 0;

        // 绘制head
        $head.append($title).append($top);

        // TODO:生成目录列表
        $anchors.each(function(i, anchor){
            var $anchor = $(anchor),
                curNum = $anchor[0].tagName.toUpperCase().replace(/[H]/ig,''),
                pid = -1,
                chapter = '';

            $anchor.attr('id', guid('anchor'));

            // 1.（父标题，子标题）：当前标题的序号 > 前一个标题的序号
            if (curNum > prevNum) {
                level += 1;

                if(level===1){
                    pid = -1;
                }
                else{
                    pid = i-1;
                }
            } else {
                // 2.（同级标题，同级标题）
                // A - 当前标题的序号 === 前一个标题的序号
                // B - 当前标题的序号 > 前一个标题的层次 && 当前标题的序号 <= 前一个标题的序号
                if (curNum === prevNum || (curNum > level && curNum <= prevNum )) {
                    level = level;

                    pid = levels[i - 1].pid;
                } else {
                    // 3.（子标题，父级标题）：当前标题的序号 < 前一个标题的层次
                    if (curNum <= level) {
                        level = level - (prevNum - curNum);

                        if (level === 1) {
                            pid = -1;
                        }
                        else {
                            pid = levels[levels[i - 1].pid - (prevNum - curNum) - 1].pid;
                        }
                    }
                }
            }

            prevNum = curNum;

            levels.push({
                id: i,
                level:level,
                text: $anchor.html(),
                value: $anchor.attr('id'),
                chapter: chapter,
                tag: anchor.tagName,
                pid: pid
            });
        });

        // 绘制body
        $body.append($list);

        // 绘制完整的导航
        $wrap.append($head).append($body);

        // 将导航和遮罩层添加到页面
        $(document.body).append($wrap).append($overlay);

        // 绘制导航索引
        $(levels).each(function(i, level) {
            var $item = $(ITEM),
                $link = $(LINK),
                sublist = document.getElementById('toc-list-'+level.pid);

            $link.attr({
                id: 'toc-link-'+level.id,
                href: '#'+level.value
            }).html(level.text);

            if(i===0){
                $item.addClass('toc-first-item');
            }

            $item.attr('id', 'toc-item-'+level.id).append($link);

            if (level.pid === -1) {
                $list.append($item);
            }
            else {
                if(sublist){
                    $(sublist).append($item);
                }
                else{
                    sublist = $(SUB_LIST).attr('id','toc-list-' + level.pid);

                    sublist.append($item);

                    $('#toc-item-'+level.pid).append(sublist);
                }
            }
        });

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