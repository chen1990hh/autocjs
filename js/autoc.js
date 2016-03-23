(function ($) {
    'use strict';

    var CLS_SHOW = 'toc-show',
        CLS_HIDE = 'hide',
        WRAP = '<div id="toc" class="toc"></div>',
        BAR = '<div title="Toggle Menu" id="toc-bar" class="toc-bar">&#926;</div>',
        TITLE = '<h3 id="toc-hd" class="toc-hd">Table of Contents</div>',
        BODY = '<nav id="toc-bd" class="toc-bd"></nav>',
        LIST = '<ul id="toc-list" class="toc-list"></ul>',
        ITEM = '<li class="toc-item"></li>',
        LINK = '<a></a>',
        OVERLAY = '<div id="toc-overlay" class="toc-overlay hide"></div>',
        ANCHORS = 'h1,h2,h3,h4,h5,h6',
        $anchors = null,
        $wrap = null,
        $bar = null,
        $title = null,
        $body = null,
        $list = null,
        $overlay = null,
        _uid = -1;

    function guid(prefix) {
        var id;

        _uid += 1;
        id = prefix ? prefix + '-' + _uid : _uid;

        return id;
    }

    function show() {
        $overlay.removeClass(CLS_HIDE);

        $wrap.animate({
            left: 0
        }, 150, function () {
            $wrap.addClass(CLS_SHOW);
        });
    }

    function hide() {

        $wrap.animate({
            left: -300
        }, 150, function () {
            $overlay.addClass(CLS_HIDE);
            $wrap.removeClass(CLS_SHOW);
        });
    }

    function toggle() {

        if ($wrap.hasClass(CLS_SHOW)) {
            hide()
        }
        else {
            show();
        }
    }

    function doLayout() {

        var wrapHeight,
            titleHeight;

        wrapHeight = $wrap[0].offsetHeight;
        titleHeight = $title[0].offsetHeight;

        $body.height(wrapHeight - titleHeight);
    }

    var autoc = function (selector, prefix) {

        // 获得所有的标题
        $anchors = $(selector || ANCHORS);

        // 初始化 DOM 部件
        $wrap = $(WRAP);
        $bar = $(BAR);
        $title = $(TITLE);
        $body = $(BODY);
        $list = $(LIST);
        $overlay = $(OVERLAY);

        // 创建菜单内容
        $anchors.each(function (i, title) {
            var $item = $(ITEM),
                $link = $(LINK),
                $title = $(title),
                id = guid(prefix || 'anchor'),
                titleText = $title.html();

            $title.attr('id', id);
            $link.attr('href', '#' + id).html(titleText);

            $item.attr('title', titleText).append($link);

            $list.append($item);
        });

        // 将完整的菜单添加到页面中
        $body.append($list);
        $wrap.append($bar).append($title).append($body);
        $(document.body).append($wrap).append($overlay);

        // 更新 DOM 的尺寸
        doLayout();

        // 绑定事件处理器
        $bar.on('click', toggle);
        $list.delegate('li', 'click', hide);
        $overlay.on('click', hide);
        $(window).on('resize', doLayout);
    };

    window.autoc = autoc;
})(jQuery);