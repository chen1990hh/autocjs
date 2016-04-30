(function ( global, factory ) {
    'use strict';

    if ( typeof define === 'function' && define.amd ) {
        // AMD (Register as an anonymous module)
        define( 'autocjs', [ 'jquery' ], factory( global, $ ) );
    }
    else {
        if ( typeof define === 'function' && define.cmd ) {
            // CMD (Register as an anonymous module)
            define( 'autocjs', function ( require, exports, module ) {
                module.exports = factory( global, require( 'jquery' ) );
            } );
        }
        else {
            if ( typeof exports === 'object' ) {
                // Node/CommonJS
                module.exports = factory( global, require( 'jquery' ) );
            }
            else {
                // Browser globals
                factory( global, jQuery );
            }
        }
    }
}( typeof window !== "undefined" ? window : this, function ( window, $ ) {
    'use strict';

    var CLS_SHOW = 'toc-show',
        CLS_HIDE = 'toc-hide',
        CLS_ANCHOR = 'autocjs-anchor',
        CLS_ICON = 'toc-icon',
        WRAP = '<div id="toc" class="toc toc-hide" aria-hidden="true"></div>',
        TITLE = '<h3 class="toc-title" id="toc-title" aria-hidden="true">Table of Contents</h3>',
        BAR = '<div class="toc-bar" aria-hidden="true"></div>',
        SWITCH = '<h2 class="toc-switch" class="toc-switch" title="Toggle Menu" aria-hidden="true">&#926;</h2>',
        TOP = '<a class="toc-top" id="toc-top" href="#top" aria-hidden="true">TOP</a>',
        BODY = '<nav id="toc-bd" class="toc-bd" aria-hidden="true"></nav>',
        LIST = '<ol id="toc-list" class="toc-list" aria-hidden="true"></ol>',
        SUB_LIST = '<ol class="toc-sub-list" aria-hidden="true"></ol>',
        ITEM = '<li class="toc-item" aria-hidden="true"></li>',
        LINK = '<a aria-hidden="true"></a>',
        ANCHOR_LINK = '<a aria-hidden="true" class="toc-anchor-link"></a>',
        CHAPTER = '<em class="toc-chapter" aria-hidden="true"></em>',
        OVERLAY = '<div id="toc-overlay" class="toc-overlay toc-hide" aria-hidden="true"></div>',
        ANCHORS = 'h1,h2,h3,h4,h5,h6',
        PREFIX = 'anchor',
        $article = null,
        $anchors = null,
        $wrap = null,
        $title = null,
        $bar = null,
        $switch = null,
        $top = null,
        $body = null,
        $list = null,
        $overlay = null,
        _uid = -1,
        chapters = [],
        /**
         * 生成唯一的 id
         *
         * @method guid
         * @param {String} [prefix] - 可选，默认生成数字ID，设置了 prefix 则生成字符串ID
         * @returns {Number|String}
         */
        guid = function ( prefix ) {
            _uid += 1;

            return prefix ? prefix + '-' + _uid : _uid;
        };

    var AutocJS = {
        version: '0.1.3',
        /**
         * Default Configration
         *
         * @prperty
         */
        defaults: {
            article: '#article',
            selector: ANCHORS,
            prefix: PREFIX,
            Templates: {
                WRAP: WRAP,
                TITLE: TITLE,
                BAR: BAR,
                SWITCH: SWITCH,
                TOP: TOP,
                BODY: BODY,
                LIST: LIST,
                SUB_LIST: LIST,
                ITEM: ITEM,
                LINK: LINK,
                ANCHOR_LINK: ANCHOR_LINK,
                CHAPTER: CHAPTER,
                OVERLAY: OVERLAY
            }
        },
        /**
         * AutocJS 对象的属性
         *
         * @prperty
         */
        attributes: {},
        /**
         * 设置部件属性
         *
         * @param config
         * @returns {AutocJS}
         */
        set: function ( config ) {

            if ( $.isPlainObject( config ) ) {
                $.extend( this.attributes, config );
            }

            return this;
        },
        /**
         * 初始化程序
         *
         * @param {Object} config - 配置信息
         * @param {String|HTMLElement} config.article
         * @param {String} [config.selector]
         * @param {String} [config.prefix]
         */
        init: function ( config ) {
            this.set( this.defaults )
                .set( config )
                ._init()
                .render()
                .attachEvents();

            return this;
        },
        /**
         * 初始化 DOM 部件
         *
         * @returns {AutocJS}
         * @private
         */
        _init: function () {
            var attrs = this.attributes,
                Templates = attrs.Templates;

            // 获得文章内容的 DOM 节点
            $article = $( attrs.article );

            // 获得文章中所有的标题
            $anchors = $article.find( attrs.selector );

            // 初始化 DOM 部件
            $wrap = $( Templates.WRAP );
            $title = $( Templates.TITLE );
            $bar = $( Templates.BAR );
            $switch = $( Templates.SWITCH );
            $top = $( Templates.TOP );
            $body = $( Templates.BODY );
            $list = $( Templates.LIST );
            $overlay = $( Templates.OVERLAY );

            return this;
        },
        /**
         * 绘制界面框架
         *
         * @returns {AutocJS}
         */
        render: function () {
            var chapters = this.getChapters();

            // 绘制head
            $bar.append( $switch ).append( $top );

            // 绘制body
            $body.append( $list );

            // 绘制完整的导航
            $wrap.append( $title ).append( $body ).append( $bar );

            // 将导航和遮罩层添加到页面
            $( document.body ).append( $wrap ).append( $overlay );

            // 给标题绘制 AnchorJS 类型的链接
            this.renderAnchorLinks( chapters );

            // 绘制具体的菜单项
            this.renderChapters( chapters );

            // 全部绘制完成，再显示完整的菜单
            $wrap.removeClass( CLS_HIDE );

            // 更新菜单的高度
            this.updateLayout();

            return this;
        },
        /**
         * 绘制类似 AnchorJS 的标题链接，此方法是借鉴 AnchorJS 的解决方案
         *
         * @see AnchorJS: http://bryanbraun.github.io/anchorjs/
         * @param {Array} chapters - 重页面中获取的h1~h6标题的章节数据
         * @returns {AutocJS}
         */
        renderAnchorLinks: function ( chapters ) {
            var attrs = this.attributes,
                Tmpl = attrs.Templates,
                LINK = Tmpl.ANCHOR_LINK;

            $( chapters ).each( function ( i, chapter ) {
                var $anchor = $( $anchors[ i ] ),
                    id = chapter.value,
                    $link = $( LINK ).attr( {
                                         'href': '#' + id,
                                         'aria-label': chapter.text
                                     } )
                                     .addClass( CLS_ICON )
                                     .addClass( CLS_HIDE );

                $anchor.attr( 'id', id )
                       .addClass( CLS_ANCHOR )
                       .append( $link );
            } );

            return this;
        },
        /**
         * 绘制章节内容
         *
         * @returns {AutocJS}
         */
        renderChapters: function ( chapters ) {
            var attrs = this.attributes,
                Tmpl = attrs.Templates,
                ITEM = Tmpl.ITEM,
                LINK = Tmpl.LINK;

            $list.empty();

            $( chapters ).each( function ( i, chapter ) {
                var $parent = null,
                    $item = $( ITEM ),
                    $link = $( LINK ),
                    $chapter = $( CHAPTER ),
                    $sublist = $( '#toc-list-' + chapter.pid ),
                    chapterText = '',
                    chapterCount = 0;

                // 创建菜单的链接
                $link.attr( {
                    id: 'toc-link-' + chapter.id,
                    href: '#' + chapter.value
                } ).html( chapter.text );

                // 创建菜单项
                $item.attr( {
                    'id': 'toc-item-' + chapter.id,
                    'title': chapter.text
                } ).append( $link );

                // 一级标题直接创建标题链接即可
                if ( chapter.pid === -1 ) {
                    $list.append( $item );
                    chapterCount = $item.index() + 1;
                    chapterText = chapterCount;
                }
                else {

                    // 子级的标题，需要找到上级章节
                    $parent = $( '#toc-item-' + chapter.pid );

                    // 没有绘制子菜单，则绘制它
                    if ( !$sublist[ 0 ] ) {
                        $sublist = $( SUB_LIST ).attr( 'id', 'toc-list-' + chapter.pid );

                        $parent.append( $sublist );
                    }

                    $sublist.append( $item );

                    // 绘制章节索引
                    chapterCount = $item.index() + 1;
                    chapterText = $parent.find( '.toc-chapter' ).html() + '.' + chapterCount;
                }

                // 绘制链接
                $chapter.attr( 'data-chapter', chapterCount ).html( chapterText );
                $chapter.insertBefore( $link );
            } );

            return this;
        },
        /**
         * 显示菜单
         *
         * @returns {AutocJS}
         */
        show: function () {
            $overlay.removeClass( CLS_HIDE );

            $wrap.animate( {
                left: 0
            }, 150, function () {
                $wrap.addClass( CLS_SHOW );
            } );

            return this;
        },
        /**
         * 隐藏菜单
         *
         * @returns {AutocJS}
         */
        hide: function () {

            $wrap.animate( {
                left: -300
            }, 150, function () {
                $overlay.addClass( CLS_HIDE );
                $wrap.removeClass( CLS_SHOW );
            } );

            return this;
        },
        /**
         * 隐藏/显示导航
         *
         * @returns {AutocJS}
         */
        toggle: function () {

            if ( $wrap.hasClass( CLS_SHOW ) ) {
                this.hide();
            }
            else {
                this.show();
            }

            return this;
        },
        /**
         * 更新菜单界面高度
         *
         * @returns {AutocJS}
         */
        updateLayout: function () {
            var wrapHeight = $wrap[ 0 ].offsetHeight,
                titleHeight = $title[ 0 ].offsetHeight;

            $body.height( wrapHeight - titleHeight );

            return this;
        },
        /**
         * 重新绘制界面
         *
         * @param {Array} data
         * @returns {AutocJS}
         */
        reload: function ( data ) {
            this.setChapters( data )
                .renderChapters( data );

            return this;
        },
        /**
         * 获得文章完整的章节索引数据
         *
         * @returns {Array}
         */
        getChapters: function () {
            var prevNum = 1,
                level = 0,
                attrs = this.attributes,
                prefix = attrs.prefix;

            // 获得目录索引信息
            $anchors.each( function ( i, anchor ) {
                var id = guid( prefix ),
                    $anchor = $( anchor ),
                    text = $anchor.html(),
                    curNum = parseInt( $anchor[ 0 ].tagName.toUpperCase().replace( /[H]/ig, '' ), 10 ),
                    pid = -1;

                // 1.（父标题，子标题）：当前标题的序号 > 前一个标题的序号
                if ( curNum > prevNum ) {
                    level += 1;

                    // 第一层级的 pid 是 -1
                    if ( level === 1 ) {
                        pid = -1;
                    }
                    else {
                        pid = i - 1;
                    }
                }
                else {
                    // 2.（同级标题，同级标题）
                    // A. 当前标题的序号 === 前一个标题的序号
                    // B. 当前标题的序号 < 前一个标题的序号 && 当前标题的序号 > 等级
                    if ( curNum === prevNum || (curNum < prevNum && curNum > level) ) {

                        // H1 的层级肯定是 1
                        if ( curNum === 1 ) {
                            level = 1;

                            pid = -1;
                        }
                        else {
                            pid = chapters[ i - 1 ].pid;
                        }
                    }
                    else {
                        // 3.（子标题，父级标题）：当前标题的序号 < 前一个标题的序号
                        if ( curNum <= level ) {

                            // H1 的层级肯定是 1
                            if ( curNum === 1 ) {
                                level = 1;
                            }
                            else {
                                level = level - (prevNum - curNum);
                            }

                            // 第一级的标题
                            if ( level === 1 ) {
                                pid = -1;
                            }
                            else {
                                // 最大只有5系的差距
                                // 虽然看上去差点，不过能工作啊
                                switch ( prevNum - curNum ) {
                                    case 1:
                                        pid = chapters[ chapters[ i - 1 ].pid ].pid;
                                        break;
                                    case 2:
                                        pid = chapters[ chapters[ chapters[ i - 1 ].pid ].pid ].pid;
                                        break;
                                    case 3:
                                        pid = chapters[ chapters[ chapters[ chapters[ i - 1 ].pid ].pid ].pid ].pid;
                                        break;
                                    case 4:
                                        pid = chapters[ chapters[ chapters[ chapters[ chapters[ i - 1 ].pid ].pid ].pid ].pid ].pid;
                                        break;
                                    case 5:
                                        pid = chapters[ chapters[ chapters[ chapters[ chapters[ chapters[ i - 1 ].pid ].pid ].pid ].pid ].pid ].pid;
                                        break;
                                    default:
                                        pid = chapters[ chapters[ i - 1 ].pid ].pid;
                                        break;
                                }
                            }
                        }
                    }
                }

                prevNum = curNum;

                chapters.push( {
                    id: i,
                    level: level,
                    text: text,
                    value: id,
                    tag: anchor.tagName,
                    pid: pid
                } );
            } );

            return chapters;
        },
        setChapters: function ( data ) {
            chapters = data;

            return this;
        },
        /**
         * 获得所有的标题标签
         *
         * @returns {HTMLElement}
         */
        getAnchors: function () {
            return $anchors;
        },
        /**
         * 获得菜单的根节点 DOM
         *
         * @returns {HTMLElement}
         */
        getWrap: function () {
            return $wrap;
        },
        /**
         * 获得菜单的标题节点
         *
         * @returns {HTMLElement}
         */
        getTitle: function () {
            return $title;
        },
        /**
         * 获得菜单的侧边控制栏
         *
         * @returns {HTMLElement}
         */
        getBar: function () {
            return $bar;
        },
        /**
         * 获得开关按钮
         *
         * @returns {HTMLElement}
         */
        getSwitchButton: function () {
            return $switch;
        },
        /**
         * 获得返回顶部按钮
         *
         * @returns {HTMLElement}
         */
        getTopButton: function () {
            return $top;
        },
        /**
         * 获得菜单内容节点
         *
         * @returns {HTMLElement}
         */
        getBody: function () {
            return $body;
        },
        /**
         * 获得菜单节点
         *
         * @returns {HTMLElement}
         */
        getList: function () {
            return $list;
        },
        /**
         * 获得遮罩层节点
         *
         * @returns {HTMLElement}
         */
        getOverlay: function () {
            return $overlay;
        },
        /**
         * 给导航菜单的各个 DOM 部件绑定事件处理器
         *
         * @returns {AutocJS}
         */
        attachEvents: function () {

            // 鼠标滑过标题，显示标题的 AutocJS 链接
            $article.delegate( '.' + CLS_ANCHOR, 'mouseenter', this._onAutocJSAnchorMouseEnter );

            // 鼠标离开标题，隐藏标题的 AutocJS 链接
            $article.delegate( '.' + CLS_ANCHOR, 'mouseleave', this._onAutocJSAnchorMouseLeave );

            // 点击目录标题，隐藏/显示目录导航
            $switch.on( 'click', this._onSwitchClick );

            // 点击TOP链接，返回页面顶部
            $top.on( 'click', this._onTopClick );

            // 点击导航，定位文章，收起导航
            $list.delegate( 'li', 'click', this._onChapterClick );

            // 点击遮罩层，收起导航
            $overlay.on( 'click', this._onOverlayClick );

            $( window ).on( 'resize', this._onWindowResize );

            return this;
        },
        _onAutocJSAnchorMouseEnter: function () {
            var $link = $( this ).find( '.' + CLS_ICON );

            $link.removeClass( CLS_HIDE );

            return AutocJS;
        },
        _onAutocJSAnchorMouseLeave: function () {
            var $link = $( this ).find( '.' + CLS_ICON );

            $link.addClass( CLS_HIDE );

            return AutocJS;
        },
        /**
         *
         * @param evt
         * @returns {AutocJS}
         * @private
         */
        _onSwitchClick: function ( evt ) {
            AutocJS.toggle();

            evt.stopPropagation();
            evt.preventDefault();

            return AutocJS;
        },
        /**
         *
         * @param evt
         * @returns {AutocJS}
         * @private
         */
        _onTopClick: function ( evt ) {
            AutocJS.hide();

            evt.stopPropagation();
            evt.preventDefault();

            return AutocJS;
        },
        /**
         *
         * @returns {AutocJS}
         * @private
         */
        _onChapterClick: function () {
            AutocJS.hide();

            return AutocJS;
        },
        /**
         *
         * @param evt
         * @returns {AutocJS}
         * @private
         */
        _onOverlayClick: function ( evt ) {
            AutocJS.hide();

            evt.stopPropagation();
            evt.preventDefault();

            return AutocJS;
        },
        /**
         *
         * @returns {AutocJS}
         * @private
         */
        _onWindowResize: function () {
            AutocJS.updateLayout();

            return AutocJS;
        }
    };

    // 将 autoc 扩展为一个 jquery 插件
    $.extend( $.fn, {
        autoc: function ( selector, prefix ) {
            var self = this,
                config = {
                    article: self,
                    selector: selector,
                    prefix: prefix
                };

            return AutocJS.init( config );
        }
    } );

    window.AutocJS = AutocJS;
    window.autoc = function ( config ) {
        return AutocJS.init( config );
    };
    
    return AutocJS;
} ));