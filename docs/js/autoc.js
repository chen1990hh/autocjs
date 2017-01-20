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

    var CLS_SHOW = 'autocjs-show',
        CLS_HIDE = 'autocjs-hide',
        CLS_TITLE = 'autocjs-title',
        CLS_ANCHOR = 'autocjs-anchor',
        CLS_SUBJECTS = 'autocjs-subjects',
        CLS_CHAPTER = 'autocjs-chapter',
        CLS_TEXT = 'autocjs-text',
        CLS_INDEX = 'autocjs-index',
        ANCHOR_LINK = '<a class="' + CLS_ANCHOR + '" aria-hidden="true"></a>',
        WRAP = '<div class="autocjs ' + CLS_HIDE + '" aria-hidden="true"></div>',
        TITLE = '<h3 class="autocjs-hd" aria-hidden="true">{title}</h3>',
        BAR = '<div class="autocjs-bar" aria-hidden="true"></div>',
        SWITCH = '<h2 class="autocjs-switch" title="Toggle Menu" aria-hidden="true">&#926;</h2>',
        TOP = '<a class="autocjs-top" href="#top" aria-hidden="true">TOP</a>',
        BODY = '<nav class="autocjs-bd" aria-hidden="true"></nav>',
        CHAPTERS = '<ol class="autocjs-chapters" aria-hidden="true"></ol>',
        SUBJECTS = '<ol class="' + CLS_SUBJECTS + '" aria-hidden="true"></ol>',
        CHAPTER = '<li class="' + CLS_CHAPTER + '" aria-hidden="true"></li>',
        CHAPTER_LINK = '<a class="' + CLS_TEXT + '" aria-hidden="true"></a>',
        CHAPTER_INDEX = '<em class="' + CLS_INDEX + '" aria-hidden="true"></em>',
        OVERLAY = '<div class="autocjs-overlay ' + CLS_HIDE + '" aria-hidden="true"></div>',
        ANCHORS = 'h1,h2,h3,h4,h5,h6',
        PREFIX = CLS_TITLE;

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
        isAnimateScroll: true,
        onlyAnchors: false,
        ANCHOR_LINK: ANCHOR_LINK,
        WRAP: WRAP,
        TITLE: TITLE,
        BAR: BAR,
        SWITCH: SWITCH,
        TOP: TOP,
        BODY: BODY,
        LIST: CHAPTERS,
        SUB_LIST: SUBJECTS,
        ITEM: CHAPTER,
        LINK: CHAPTER_LINK,
        CHAPTER: CHAPTER_INDEX,
        OVERLAY: OVERLAY
    };

    AutocJS.prototype = {
        version: '0.2.1',
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
            $( this.getArticleAnchors() ).each( function ( i, anchor ) {
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

            this._init().render()._attachEvents();

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

            console.log( this.data );

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
            var onlyAnchors = this.get( 'onlyAnchors' );

            this.renderAnchors();

            if ( !onlyAnchors ) {

                // 绘制导航菜单框架
                // 绘制导航链接
                this.renderElements().renderChapters();

                // 全部绘制完成，再显示完整的菜单
                this.elements.wrap.removeClass( CLS_HIDE );

                // 最后更新菜单的高度
                this.updateLayout();
            }

            return this;
        },
        /**
         * 绘制类似 AnchorJS 的标题链接，此方法是借鉴 AnchorJS 的解决方案
         *
         * @see AnchorJS: http://bryanbraun.github.io/anchorjs/
         * @returns {AutocJS}
         */
        renderAnchors: function () {
            var self = this,
                anchors = this.anchors(),
                chapters = this.chapters();

            $( chapters ).each( function ( i, chapter ) {
                var $anchor = $( anchors[ i ] ),
                    id = chapter.value,
                    $link = $( self.get( 'ANCHOR_LINK' ) ).attr( {
                        'href': '#' + id,
                        'aria-label': chapter.text
                    } ).addClass( CLS_ANCHOR ).addClass( CLS_HIDE );

                $anchor.attr( 'id', id ).addClass( CLS_TITLE ).append( $link );
            } );

            return this;
        },
        renderElements: function () {
            var $elements = this.elements,
                $body = $( document.body ),
                isAnimateScroll = this.get( 'isAnimateScroll' );

            // 绘制head
            $elements.bar.append( $elements.switch ).append( $elements.top );

            // 绘制body
            $elements.body.append( $elements.list );

            // 绘制完整的导航
            $elements.wrap.append( $elements.title ).append( $elements.body ).append( $elements.bar );

            // 将导航和遮罩层添加到页面
            $body.append( $elements.wrap ).append( $elements.overlay );

            if ( !isAnimateScroll ) {
                $body.attr( 'id', 'top' );
            }

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

            $( chapters ).each( function ( i, chapter ) {
                var $parent = null,
                    $chapter = $( self.get( 'ITEM' ) ),
                    $link = $( self.get( 'LINK' ) ),
                    $index = $( self.get( 'CHAPTER' ) ),
                    $subjects = $( '#' + CLS_SUBJECTS + '-' + chapter.pid ),
                    chapterText = '',
                    chapterCount = 0;

                // 创建菜单的链接
                $link.attr( {
                    id: CLS_TEXT + '-' + chapter.id,
                    href: '#' + chapter.value,
                    rel: chapter.value
                } ).html( chapter.text );

                // 创建菜单项
                $chapter.attr( {
                    'id': CLS_CHAPTER + '-' + chapter.id,
                    'title': chapter.text
                } ).append( $link );

                // 一级标题直接创建标题链接即可
                if ( chapter.pid === -1 ) {
                    $list.append( $chapter );
                    chapterCount = $chapter.index() + 1;
                    chapterText = chapterCount;
                }
                else {

                    // 子级的标题，需要找到上级章节
                    $parent = $( '#' + CLS_CHAPTER + '-' + chapter.pid );

                    // 没有绘制子菜单，则绘制它
                    if ( !$subjects[ 0 ] ) {
                        $subjects = $( self.get( 'SUB_LIST' ) ).attr( 'id', CLS_SUBJECTS + '-' + chapter.pid );

                        $parent.append( $subjects );
                    }

                    $subjects.append( $chapter );

                    // 绘制章节索引
                    chapterCount = $chapter.index() + 1;
                    chapterText = $parent.find( '.' + CLS_INDEX ).html() + '.' + chapterCount;
                }

                // 绘制链接
                $index.attr( 'data-chapter', chapterCount ).html( chapterText );
                $index.insertBefore( $link );
            } );

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
        scrollTo: function ( top ) {
            var self = this;

            $( document.body ).animate( {
                scrollTop: top
            }, 500, 'linear', function () {
                self.hide();
            } );

            return this;
        },
        /**
         * 给导航菜单的各个 DOM 部件绑定事件处理器
         *
         * @returns {AutocJS}
         */
        _attachEvents: function () {
            var self = this,
                $elements = this.elements,
                $article = $elements.article,
                data = {
                    context: self
                },
                onlyAnchors = this.get( 'onlyAnchors' );

            // 鼠标滑过标题，显示标题的 AutocJS 链接
            $article.delegate( '.' + CLS_TITLE, 'mouseenter', data, this._onAutocJSAnchorMouseEnter );

            // 鼠标离开标题，隐藏标题的 AutocJS 链接
            $article.delegate( '.' + CLS_TITLE, 'mouseleave', data, this._onAutocJSAnchorMouseLeave );

            if ( !onlyAnchors ) {
                // 点击目录标题，隐藏/显示目录导航
                $elements.switch.on( 'click', data, this._onSwitchClick );

                // 点击TOP链接，返回页面顶部
                $elements.top.on( 'click', data, this._onTopClick );

                // 点击导航，定位文章，收起导航
                $elements.list.delegate( '.' + CLS_TEXT, 'click', data, this._onChapterClick );

                // 点击遮罩层，收起导航
                $elements.overlay.on( 'click', data, this._onOverlayClick );

                $( window ).on( 'resize', data, this._onWindowResize );
            }

            return this;
        },
        _onAutocJSAnchorMouseEnter: function ( evt ) {
            var context = evt.data.context,
                $anchor = $( this ).find( '.' + CLS_ANCHOR );

            $anchor.removeClass( CLS_HIDE );

            return context;
        },
        _onAutocJSAnchorMouseLeave: function ( evt ) {
            var context = evt.data.context,
                $anchor = $( this ).find( '.' + CLS_ANCHOR );

            $anchor.addClass( CLS_HIDE );

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
            var context = evt.data.context,
                isAnimateScroll = context.get( 'isAnimateScroll' );

            if ( isAnimateScroll ) {
                context.scrollTo( 0 );

                evt.stopPropagation();
                evt.preventDefault();
            }
            else {
                context.hide();
            }

            return context;
        },
        /**
         *
         * @returns {AutocJS}
         * @private
         */
        _onChapterClick: function ( evt ) {
            var context = evt.data.context,
                isAnimateScroll = context.get( 'isAnimateScroll' ),
                $chapter = $( '#' + $( this ).attr( 'rel' ) );

            if ( isAnimateScroll ) {
                context.scrollTo( $chapter[ 0 ].offsetTop );

                evt.stopPropagation();
                evt.preventDefault();
            }
            else {
                context.hide();
            }

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
            var config = {};

            options.article = $( this );

            $.extend( config, options );

            return new AutocJS( config );
        }
    } );

    window.AutocJS = AutocJS;

    return AutocJS;
} ));