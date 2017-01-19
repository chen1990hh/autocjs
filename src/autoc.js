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
}( typeof window !== 'undefined' ? window : this, function ( window, $ ) {
    'use strict';

    var HTML_CHARS = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;',
            '`': '&#x60;'
        },
        SCRIPT_FRAGMENT = '<script[^>]*>([\\S\\s]*?)<\/script\\s*>',
        _uid = -1;

    function stripScripts ( html ) {
        return html.replace( new RegExp( SCRIPT_FRAGMENT, 'img' ), '' );
    }

    function encodeHTML ( html ) {
        return html.replace( /[\r\t\n]/g, ' ' ).replace( /[&<>"'\/`]/g, function ( match ) {
            return HTML_CHARS[ match ];
        } );
    }

    function decodeHTML ( html ) {
        return html.replace( /&lt;/g, '<' ).replace( /&gt;/g, '>' ).replace( /&amp;/g, '&' ).replace( /&quot;/g, '"' ).replace( /&#x27;/g, '\'' ).replace( /&#x2F;/g, '\/' ).replace( /&#x60;/g, '`' );
    }

    function safetyHTML ( html ) {
        return decodeHTML( encodeHTML( stripScripts( html ) ) );
    }

    function template ( options ) {
        var json = options.data,
            html = options.html,
            startTag = options.startTag || '{',
            endTag = options.endTag || '}',
            key;

        html += '';

        for ( key in json ) {
            html = html.replace( new RegExp( startTag + key + endTag, 'img' ), safetyHTML( json[ key ] ) );
        }

        return safetyHTML( html );
    }

    /**
     * 生成唯一的 id
     *
     * @method guid
     * @param {String} [prefix] - 可选，默认生成数字ID，设置了 prefix 则生成字符串ID
     * @returns {Number|String}
     */
    function guid ( prefix ) {
        _uid += 1;

        return prefix ? prefix + '-' + _uid : _uid;
    }

    var CLS_SHOW = 'toc-show',
        CLS_HIDE = 'toc-hide',
        CLS_ANCHOR = 'autocjs-anchor',
        CLS_ICON = 'toc-icon',
        WRAP = '<div id="toc" class="toc toc-hide" aria-hidden="true"></div>',
        TITLE = '<h3 class="toc-title" id="toc-title" aria-hidden="true">{title}</h3>',
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
        PREFIX = 'anchor';

    /**
     * AutocJS 构造函数
     *
     * @param options
     * @returns {AutocJS}
     * @constructor
     */
    var AutocJS = function ( options ) {
        this.attributes = {};

        this.elements = {
            article: null,
            wrap: null,
            title: null,
            bar: null,
            switch: null,
            top: null,
            body: null,
            list: null,
            overlay: null
        };

        this.data = {
            anchors: [],
            chapters: []
        };

        this.set( AutocJS.defaults );

        if ( $.isPlainObject( options ) ) {
            this.init( options );
        }

        return this;
    };

    /**
     * @property
     * @static
     */
    AutocJS.defaults = {
        article: '#article',
        title: 'Table of Contents',
        selector: ANCHORS,
        prefix: PREFIX,
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
    };

    AutocJS.prototype = {
        version: '0.2.0',
        constructor: AutocJS,
        /**
         * 设置配置属性
         *
         * @param options
         * @returns {AutocJS}
         */
        set: function ( options ) {

            if ( $.isPlainObject( options ) ) {
                $.extend( this.attributes, options );
            }

            return this;
        },
        /**
         * 获得配置属性
         *
         * @param {String} prop
         * @returns {any}
         */
        get: function ( prop ) {
            return this.attributes[ prop ];
        },
        anchors: function ( data ) {

            if ( $.isArray( data ) ) {
                this.data.anchors = data;
            }
            else {
                return this.data.anchors;
            }

            return this;
        },
        chapters: function ( data ) {

            if ( $.isPlainObject( data ) ) {
                this.data.chapters = data;
            }
            else {
                return this.data.chapters;
            }

            return this;
        },
        getArticleAnchors: function () {
            return this.elements.article.find( this.get( 'selector' ) );
        },
        /**
         * 获得文章完整的章节索引数据
         *
         * @returns {Array}
         */
        getArticleChapters: function () {
            var self = this,
                chapters = [],
                previous = 1,
                level = 0,
                prefix = this.get( 'prefix' );

            // 获得目录索引信息
            $(this.getArticleAnchors()).each(function ( i, anchor ) {
                var id = guid( prefix ),
                    $anchor = $( anchor ),
                    text = $anchor.html(),
                    current = parseInt( $anchor[ 0 ].tagName.toUpperCase().replace( /[H]/ig, '' ), 10 ),
                    pid = -1;

                // 1.（父标题，子标题）：当前标题的序号 > 前一个标题的序号
                if ( current > previous ) {
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
                    if ( current === previous || (current < previous && current > level) ) {

                        // H1 的层级肯定是 1
                        if ( current === 1 ) {
                            level = 1;

                            pid = -1;
                        }
                        else {
                            pid = chapters[ i - 1 ].pid;
                        }
                    }
                    else {
                        // 3.（子标题，父级标题）：当前标题的序号 < 前一个标题的序号
                        if ( current <= level ) {

                            // H1 的层级肯定是 1
                            if ( current === 1 ) {
                                level = 1;
                            }
                            else {
                                level = level - (previous - current);
                            }

                            // 第一级的标题
                            if ( level === 1 ) {
                                pid = -1;
                            }
                            else {
                                // 虽然看上去差点，不过能工作啊
                                pid = self.getPidByDiffer( chapters, previous - current, i );
                            }
                        }
                    }
                }

                previous = current;

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

        /**
         * 根据 prevNum, curNum的差值，获得父级的 id 值
         *
         * @param {number} differ
         * @returns {number}
         */
        getPidByDiffer: function ( chapters, differ, index ) {
            var pid = -1;

            // 最大只有5系的差距
            switch ( differ ) {
                case 1:
                    pid = chapters[ chapters[ index - 1 ].pid ].pid;
                    break;
                case 2:
                    pid = chapters[ chapters[ chapters[ index - 1 ].pid ].pid ].pid;
                    break;
                case 3:
                    pid = chapters[ chapters[ chapters[ chapters[ index - 1 ].pid ].pid ].pid ].pid;
                    break;
                case 4:
                    pid = chapters[ chapters[ chapters[ chapters[ chapters[ index - 1 ].pid ].pid ].pid ].pid ].pid;
                    break;
                case 5:
                    pid = chapters[ chapters[ chapters[ chapters[ chapters[ chapters[ index - 1 ].pid ].pid ].pid ].pid ].pid ].pid;
                    break;
                default:
                    pid = chapters[ chapters[ index - 1 ].pid ].pid;
                    break;
            }

            return pid;
        },
        /**
         * 初始化程序
         * 1. 初始化配置参数
         * 2. 绘制UI界面
         * 3. 绑定 DOM 节点的相应的事件处理器
         *
         * @param {Object} options - 配置信息
         * @returns {AutocJS}
         */
        init: function ( options ) {

            if ( $.isPlainObject( options ) ) {
                this.set( options );
            }

            this._init().render().attachEvents();

            return this;
        },
        /**
         * 初始化 AutocJS 的各个属性
         *
         * @returns {AutocJS}
         * @private
         */
        _init: function () {
            var self = this,
                $elements = this.elements;

            // 获得文章内容的 DOM 节点
            $elements.article = $( this.get( 'article' ) );

            // 初始化 DOM 部件
            $elements.wrap = $( this.get( 'WRAP' ) );
            $elements.title = $( template( {
                data: {
                    title: self.get( 'title' )
                },
                html: self.get( 'TITLE' )
            } ) );
            $elements.bar = $( this.get( 'BAR' ) );
            $elements.switch = $( this.get( 'SWITCH' ) );
            $elements.top = $( this.get( 'TOP' ) );
            $elements.body = $( this.get( 'BODY' ) );
            $elements.list = $( this.get( 'LIST' ) );
            $elements.overlay = $( this.get( 'OVERLAY' ) );

            // 获得所有标题元素
            this.data.anchors = this.getArticleAnchors();
            this.data.chapters = this.getArticleChapters();

            return this;
        },
        /**
         * 绘制 UI 界面
         * 1. 给标题绘制 AnchorJS 类型的链接
         * 2. 绘制 AutoJS 菜单的主框架
         * 3. 绘制具体的菜单项
         *
         * @returns {AutocJS}
         */
        render: function () {

            this.renderLinks().renderElements().renderChapters();

            // 全部绘制完成，再显示完整的菜单
            this.elements.wrap.removeClass( CLS_HIDE );

            // 最后更新菜单的高度
            this.updateLayout();

            return this;
        },
        renderElements: function () {
            var $elements = this.elements;

            // 绘制head
            $elements.bar.append( $elements.switch ).append( $elements.top );

            // 绘制body
            $elements.body.append( $elements.list );

            // 绘制完整的导航
            $elements.wrap.append( $elements.title ).append( $elements.body ).append( $elements.bar );

            // 将导航和遮罩层添加到页面
            $( document.body ).append( $elements.wrap ).append( $elements.overlay ).attr( 'id', 'top' );

            return this;
        },
        /**
         * 绘制类似 AnchorJS 的标题链接，此方法是借鉴 AnchorJS 的解决方案
         *
         * @see AnchorJS: http://bryanbraun.github.io/anchorjs/
         * @returns {AutocJS}
         */
        renderLinks: function () {
            var self = this,
                anchors = this.anchors(),
                chapters = this.chapters();

            $(chapters).each( function ( i, chapter  ) {
                var $anchor = $( anchors[ i ] ),
                    id = chapter.value,
                    $link = $( self.get( 'LINK' ) ).attr( {
                        'href': '#' + id,
                        'aria-label': chapter.text
                    } ).addClass( CLS_ICON ).addClass( CLS_HIDE );

                $anchor.attr( 'id', id ).addClass( CLS_ANCHOR ).append( $link );
            } );

            return this;
        },
        /**
         * 绘制章节内容
         *
         * @returns {AutocJS}
         */
        renderChapters: function () {
            var self = this,
                $list = this.elements.list,
                chapters = this.chapters();

            $list.empty();

            $(chapters).each( function ( i, chapter ) {
                var $parent = null,
                    $item = $( self.get( 'ITEM' ) ),
                    $link = $( self.get( 'LINK' ) ),
                    $chapter = $( self.get( 'CHAPTER' ) ),
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
            });

            return this;
        },
        /**
         * 显示菜单
         *
         * @returns {AutocJS}
         */
        show: function () {
            var $elements = this.elements,
                $wrap = $elements.wrap;

            $elements.overlay.removeClass( CLS_HIDE );

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
            var $elements = this.elements,
                $wrap = $elements.wrap;

            $wrap.animate( {
                left: -300
            }, 150, function () {
                $elements.overlay.addClass( CLS_HIDE );
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

            if ( this.elements.wrap.hasClass( CLS_SHOW ) ) {
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
            var $elements = this.elements,
                wrapHeight = $elements.wrap[ 0 ].offsetHeight,
                titleHeight = $elements.title[ 0 ].offsetHeight;

            $elements.body.height( wrapHeight - titleHeight );

            return this;
        },
        /**
         * 重新绘制界面
         *
         * @param {Array} data
         * @returns {AutocJS}
         */
        reload: function ( data ) {
            this.chapters( data ).renderChapters();

            return this;
        },
        /**
         * 给导航菜单的各个 DOM 部件绑定事件处理器
         *
         * @returns {AutocJS}
         */
        attachEvents: function () {
            var self = this,
                $elements = this.elements,
                $article = $elements.article,
                data = {
                    context: self
                };

            // 鼠标滑过标题，显示标题的 AutocJS 链接
            $article.delegate( '.' + CLS_ANCHOR, 'mouseenter', data, this._onAutocJSAnchorMouseEnter );

            // 鼠标离开标题，隐藏标题的 AutocJS 链接
            $article.delegate( '.' + CLS_ANCHOR, 'mouseleave', data, this._onAutocJSAnchorMouseLeave );

            // 点击目录标题，隐藏/显示目录导航
            $elements.switch.on( 'click', data, this._onSwitchClick );

            // 点击TOP链接，返回页面顶部
            $elements.top.on( 'click', data, this._onTopClick );

            // 点击导航，定位文章，收起导航
            $elements.list.delegate( 'li', 'click', data, this._onChapterClick );

            // 点击遮罩层，收起导航
            $elements.overlay.on( 'click', data, this._onOverlayClick );

            $( window ).on( 'resize', data, this._onWindowResize );

            return this;
        },
        _onAutocJSAnchorMouseEnter: function ( evt ) {
            var context = evt.data.context,
                $link = $( this ).find( '.' + CLS_ICON );

            $link.removeClass( CLS_HIDE );

            return context;
        },
        _onAutocJSAnchorMouseLeave: function ( evt ) {
            var context = evt.data.context,
                $link = $( this ).find( '.' + CLS_ICON );

            $link.addClass( CLS_HIDE );

            return context;
        },
        /**
         *
         * @param evt
         * @returns {AutocJS}
         * @private
         */
        _onSwitchClick: function ( evt ) {
            var context = evt.data.context;

            context.toggle();

            evt.stopPropagation();
            evt.preventDefault();

            return context;
        },
        /**
         *
         * @param evt
         * @returns {AutocJS}
         * @private
         */
        _onTopClick: function ( evt ) {
            var context = evt.data.context;

            context.hide();

            return context;
        },
        /**
         *
         * @returns {AutocJS}
         * @private
         */
        _onChapterClick: function ( evt ) {
            var context = evt.data.context;

            context.hide();

            return context;
        },
        /**
         *
         * @param evt
         * @returns {AutocJS}
         * @private
         */
        _onOverlayClick: function ( evt ) {
            var context = evt.data.context;

            context.hide();

            evt.stopPropagation();
            evt.preventDefault();

            return context;
        },
        /**
         *
         * @returns {AutocJS}
         * @private
         */
        _onWindowResize: function ( evt ) {
            var context = evt.data.context;

            context.updateLayout();

            return context;
        }
    };


    // 将 autoc 扩展为一个 jquery 插件
    $.extend( $.fn, {
        autoc: function ( options ) {
            var self = this,
                defaults = AutocJS.defaults,
                selector = options && options.selector ? options.selector : defaults.selector,
                prefix = options && options.prefix ? options.prefix : defaults.prefix,
                title = options && options.title ? options.title : defaults.title;

            return new AutocJS( {
                article: self,
                selector: selector,
                prefix: prefix,
                title: title
            } );
        }
    } );

    window.AutocJS = AutocJS;

    window.autoc = function ( config ) {
        return new AutocJS( config );
    };

    return AutocJS;
} ));