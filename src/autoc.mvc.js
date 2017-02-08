/**
 * Created by Yaohaixiao on 2017/2/8.
 */
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
        uid = -1,
        ARTICLE_PREFIX = 'article-',
        CLS_HEADING = 'autocjs-heading',
        CLS_ANCHOR = 'autocjs-anchor',
        CLS_WRAP = 'autocjs',
        CLS_CHAPTERS = 'autocjs-chapters',
        CLS_ARTICLE_CHAPTERS = ARTICLE_PREFIX + CLS_CHAPTERS,
        CLS_SUBJECTS = 'autocjs-subjects',
        CLS_CHAPTER = 'autocjs-chapter',
        CLS_TEXT = 'autocjs-text',
        CLS_CODE = 'autocjs-code',
        CLS_SHOW = 'autocjs-show',
        CLS_HIDE = 'autocjs-hide',
        ANCHOR = '<a class="' + CLS_ANCHOR + '" aria-hidden="true"></a>',
        WRAP = '<div id="{id}" class="' + CLS_WRAP + ' ' + CLS_HIDE + '" aria-hidden="true"></div>',
        HEADER = '<h2 class="autocjs-hd" aria-hidden="true">{title}</h2>',
        BODY = '<nav class="autocjs-bd" aria-hidden="true"></nav>',
        CHAPTERS = '<ol class="' + CLS_CHAPTERS + '" aria-hidden="true"></ol>',
        SUBJECTS = '<ol class="' + CLS_SUBJECTS + '" aria-hidden="true"></ol>',
        CHAPTER = '<li class="' + CLS_CHAPTER + '" aria-hidden="true"></li>',
        TEXT = '<a class="' + CLS_TEXT + '" aria-hidden="true"></a>',
        CODE = '<em class="' + CLS_CODE + '" aria-hidden="true"></em>',
        FOOTER = '<div class="autocjs-ft" aria-hidden="true"></div>',
        SWITCHER = '<h2 class="autocjs-switcher" title="Toggle Menu" aria-hidden="true">&#926;</h2>',
        TOP = '<a class="autocjs-top" href="#top" aria-hidden="true">TOP</a>',
        OVERLAY = '<div class="autocjs-overlay ' + CLS_HIDE + '" aria-hidden="true"></div>',
        SELECTOR = 'h1,h2,h3,h4,h5,h6';

    /**
     * 返回移除 JavaScript 代码后的字符串
     *
     * @method stripScripts
     * @param {String} html
     * @returns {String}
     */
    function stripScripts( html ) {
        return html.replace( new RegExp( SCRIPT_FRAGMENT, 'img' ), '' );
    }

    /**
     * 返回将 HTML 标签代码转义成对应的实体字符串
     *
     * @method encodeHTML
     * @param {String} html
     * @returns {String}
     */
    function encodeHTML( html ) {
        return html.replace( /[\r\t\n]/g, ' ' ).replace( /[&<>"'\/`]/g, function ( match ) {
            return HTML_CHARS[ match ];
        } );
    }

    /**
     * 返回将 HTML 实体字符串转义成对应的 HTML 标签代码
     *
     * @method decodeHTML
     * @param {String} html
     * @returns {String}
     */
    function decodeHTML( html ) {
        return html.replace( /&lt;/g, '<' )
                   .replace( /&gt;/g, '>' )
                   .replace( /&amp;/g, '&' )
                   .replace( /&quot;/g, '"' )
                   .replace( /&#x27;/g, '\'' )
                   .replace( /&#x2F;/g, '\/' )
                   .replace( /&#x60;/g, '`' );
    }

    /**
     * 返回安全的 HTML 代码：
     * 1. 移除 JS 代码；
     * 2. 转义 HTML 标签字符串
     * 3. 转义 HTML 实体字符串
     *
     * @method safetyHTML
     * @param {String} html
     * @returns {String}
     */
    function safetyHTML( html ) {
        return decodeHTML( encodeHTML( stripScripts( html ) ) );
    }

    /**
     * 一个简单的 HTML 模板工具，返回用 JSON 数据中的值替换特殊字符后 HTML 模板字符串。
     *
     * @method template
     * @param {Object} options - 配置参数
     * @param {Object} options.data - 模板的 JSON 对象格式数据
     * @param {String} options.html - 模板的 HTML 代码片段
     * @param {String} [options.startTag] - HTML 代码片段中特殊字符的开始标签
     * @param {String} [options.endTag] - HTML 代码片段中特殊字符的结束标签
     * @returns {String}
     */
    function template( options ) {
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
     * 返回唯一的 id
     *
     * @method guid
     * @param {String} [prefix] - 可选，默认生成数字ID，设置了 prefix 则生成字符串ID
     * @returns {Number|String}
     */
    function guid( prefix ) {
        uid += 1;

        return prefix ? prefix + '-' + uid : uid;
    }

    function isObject( obj ) {
        return (obj && (typeof obj === 'object' || $.isFunction( obj ))) || false;
    }

    /**
     * 返回 headings 对应的文章段落信息数据
     *
     * @returns {Array}
     */
    function getChapters( headings ) {
        var chapters = [],
            previous = 1,
            level = 0;

        // 获得目录索引信息
        $( headings ).each( function ( i, heading ) {
            var $heading = $( heading ),
                text = $heading.text(),
                current = parseInt( $heading[ 0 ].tagName.toUpperCase().replace( /[H]/ig, '' ), 10 ),
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
                            pid = getPidByDiffer( chapters, previous - current, i );
                        }
                    }
                }
            }

            previous = current;

            chapters.push( {
                id: i,
                level: level,
                text: text,
                tag: heading.tagName,
                pid: pid
            } );
        } );

        return chapters;
    }

    /**
     * 返回 chapters 对应动态创建的标题锚点链接节点
     *
     * @param {Array} chapters
     * @param {String} anchorHTML
     * @returns {Array}
     */
    function getAnchors( chapters, anchorHTML ) {
        var anchors = [];

        $( chapters ).each( function ( i, chapter ) {
            var id = chapter.id,
                $anchor = $( anchorHTML ).attr( {
                    id: CLS_ANCHOR + '-' + id,
                    'href': '#' + CLS_HEADING + '-' + id,
                    'aria-label': chapter.text
                } ).addClass( CLS_ANCHOR ).addClass( CLS_HIDE );

            anchors.push( $anchor );
        } );

        return anchors;
    }

    /**
     * 返回 chapters 根据 pid 分组的文章段落数据
     *
     * @param chapters
     * @returns {Array}
     */
    function getList( chapters ) {
        var temp = {},
            list = [];

        $( chapters ).each( function ( i, chapter ) {
            var key = chapter.pid === -1 ? 'H1' : chapter.pid.toString();

            if ( !temp[ key ] ) {
                temp[ key ] = [];
            }
        } );

        $.each( temp, function ( key ) {
            $( chapters ).each( function ( i, chapter ) {
                var pid = chapter.pid === -1 ? 'H1' : chapter.pid.toString();

                if ( key === pid ) {
                    temp[ key ].push( chapter );
                }
            } );

            list.push( temp[ key ] );
        } );

        return list;
    }

    /**
     * 根据两个相邻的标题标签的数字的差值，获得父级的 id 值
     *
     * @method getPidByDiffer
     * @param {Array} chapters -
     * @param {Number} differ -
     * @param {Number} index -
     * @returns {Number}
     */
    function getPidByDiffer( chapters, differ, index ) {
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
    }

    var AutocJS = function ( options ) {

        this.model = new AutocJS.Model();
        this.view = new AutocJS.View();
        this.controller = new AutocJS.Controller();

        if ( $.isPlainObject( options ) ) {
            this.initialize( options );
        }

        return this;
    };
    AutocJS.prototype = {
        version: '1.0.1',
        initialize: function ( options ) {

            var model = this.model.initialize( options ),
                view = this.view.initialize( model );

            this.controller.initialize( model, view );

            this.render().trigger();

            return this;
        },
        chapters: function(headings){
            return this.model.chapters(headings);
        },
        list: function(){
            return this.model.list();
        },
        reload: function ( options ) {

            this.destroy().initialize( $.extend( this.model.attributes, options ) );

            return this;
        },
        render: function () {
            this.view.render();

            return this;
        },
        destroy: function () {
            this.view.destroy();

            return this;
        },
        trigger: function () {
            this.controller.trigger();

            return this;
        }
    };

    AutocJS.Model = function ( options ) {
        this.attributes = {};

        this.elements = {
            article: null,
            headings: null,
            // 将 hasDirectoryInArticle 参数设置为 true 时，在文章正文开始处创建的目录导航列表 DOM 节点
            chapters: null,
            // AutocJS 对象创建的目录导航菜单的根节点
            wrap: null,
            // AutocJS 对象创建的目录导航菜单的标题栏 DOM 节点
            header: null,
            // AutocJS 对象创建的目录导航菜单的正文内容 DOM 节点
            body: null,
            // AutocJS 对象创建的目录导航菜单的列表 DOM 节点
            list: null,
            // AutocJS 对象创建的目录导航菜单的页脚 DOM 节点
            footer: null,
            // AutocJS 对象创建的目录导航菜单的隐藏显示开关 DOM 节点
            switcher: null,
            // AutocJS 对象创建的目录导航菜单中的返回顶部 DOM 节点
            top: null,
            // AutocJS 对象创建的目录导航菜单的遮罩层 DOM 节点
            overlay: null
        };

        this.data = {
            chapters: [],
            anchors: [],
            list: []
        };

        this.set( AutocJS.defaults );

        if ( $.isPlainObject( options ) ) {
            this.initialize( options );
        }

        return this;
    };
    AutocJS.Model.prototype = {
        version: '1.0.1',
        initialize: function ( options ) {

            if ( $.isPlainObject( options ) ) {
                this.set( options );
            }

            this.initializeDOM().initializeData();

            return this;
        },
        initializeDOM: function () {
            var self = this,
                elements = this.dom();

            elements.article = $( this.get( 'article' ) );

            elements.headings = elements.article.find( this.get( 'selector' ) );

            // 初始化文章开始处的导航列表
            elements.chapters = $( this.get( 'CHAPTERS' ) ).addClass( CLS_ARTICLE_CHAPTERS );

            // 初始化 DOM 部件
            elements.wrap = $( template( {
                data: {
                    id: guid( CLS_WRAP )
                },
                html: self.get( 'WRAP' )
            } ) );
            elements.header = $( template( {
                data: {
                    title: self.get( 'title' )
                },
                html: self.get( 'HEADER' )
            } ) );
            elements.body = $( this.get( 'BODY' ) );
            elements.list = $( this.get( 'CHAPTERS' ) );
            elements.footer = $( this.get( 'FOOTER' ) );
            elements.switcher = $( this.get( 'SWITCHER' ) );
            elements.top = $( this.get( 'TOP' ) );
            elements.overlay = $( this.get( 'OVERLAY' ) );

            return this;
        },
        initializeData: function () {
            var elements = this.dom();

            this.data.chapters = getChapters( elements.headings );
            this.data.anchors = getAnchors( this.chapters(), this.get( 'ANCHOR' ) );
            this.data.list = getList( this.chapters() );

            return this;
        },
        set: function ( options ) {

            if ( $.isPlainObject( options ) ) {
                $.extend( this.attributes, options );
            }

            return this;
        },
        get: function ( prop ) {
            return this.attributes[ prop ];
        },
        dom: function () {
            return this.elements;
        },
        chapters: function ( headings ) {

            if ( headings ) {
                this.data.chapters = getChapters( headings );
            }
            else {
                return getChapters( this.dom().headings );
            }

            return this;
        },
        anchors: function () {
            return this.data.anchors;
        },
        /**
         * 返回 data 属性（文章段落数据）按 pid 分组的二维数组
         *
         * @since 1.0.0
         * @returns {Array}
         */
        list: function () {
            return this.data.list;
        },
        /**
         * 返回 chapter 在 list() 返回的数据中对应段落层次位置索引值
         *
         * @param {Object} chapter - 某个文章标题对应的段落章节信息
         * @returns {Number}
         */
        getChapterIndex: function ( chapter ) {
            var index = -1;

            $( this.list() ).each( function ( i, list ) {
                $( list ).each( function ( j, data ) {
                    if ( data === chapter ) {
                        index = j;
                        return false;
                    }
                } );
            } );

            return index;
        }
    };

    AutocJS.View = function ( model ) {
        this.model = null;

        if ( isObject( model ) ) {
            this.initialize( model );
        }

        return this;
    };
    AutocJS.View.prototype = {
        version: '1.0.1',
        initialize: function ( model ) {

            if ( model ) {
                this.model = model;
            }

            return this;
        },
        render: function () {

            this.renderArticleDirectory()
                .renderAnchors()
                .renderSidebarDirectory();

            return this;
        },
        renderArticleDirectory: function () {
            var model = this.model,
                elements = model.dom(),
                $first = $( elements.article[ 0 ].firstChild );

            if ( !model.get( 'hasDirectoryInArticle' ) ) {
                return this;
            }

            elements.chapters.insertBefore( $first );

            this.renderArticleChapters();

            return this;
        },
        renderArticleChapters: function () {
            var model = this.model;

            if ( model.get( 'hasDirectoryInArticle' ) ) {
                this.renderChapters( model.dom().chapters );
            }

            return this;
        },
        renderAnchors: function () {
            var self = this,
                model = this.model,
                elements = model.dom(),
                headings = elements.headings,
                anchors = model.anchors();

            $( model.chapters() ).each( function ( i, chapter ) {
                var id = CLS_HEADING + '-' + chapter.id,
                    $heading = $( headings[ i ] ),
                    $existingAnchor = $heading.find( '#' + id ),
                    $anchor = $( anchors[ i ] );

                if ( $existingAnchor[ 0 ] ) {
                    $existingAnchor.remove();
                }

                $heading.attr( 'id', id )
                        .addClass( CLS_HEADING )
                        .append( $anchor );

                self.renderHeadingChapterCode( chapter );
            } );

            return this;
        },
        renderHeadingChapterCode: function ( chapter ) {
            var CODE = ARTICLE_PREFIX + CLS_CODE,
                model = this.model,
                pid = chapter.pid,
                id = chapter.id,
                tag = chapter.tag,
                $anchor = $( '#' + CLS_HEADING + '-' + id ),
                $existingCode = $anchor.find( '#' + CODE + '-' + id ),
                $code,
                chapterCode,
                chapterIndex;

            if ( $existingCode[ 0 ] ) {
                $existingCode.remove();
            }

            if ( !model.get( 'hasChapterCodeAtHeadings' ) || tag === 'H1' ) {
                return this;
            }

            $code = $( model.get( 'CODE' ) ).attr( 'id', CODE + '-' + id );

            // 绘制章节索引
            chapterIndex = model.getChapterIndex( chapter ) + 1;

            if ( pid === -1 && tag === 'H2' ) {
                chapterCode = chapterIndex;
            }
            else {
                chapterCode = $( '#' + CODE + '-' + pid ).html() + '.' + chapterIndex;
            }

            // 绘制段落章节编码
            $code.attr( 'data-chapter', chapterCode ).html( chapterCode );
            $code.insertBefore( $anchor[ 0 ].firstChild );

            return this;
        },
        renderSidebarDirectory: function () {
            var model = this.model;

            if ( model.get( 'isAnchorsOnly' ) ) {
                return this;
            }

            // 绘制导航菜单框架
            // 绘制导航链接
            this.renderSidebarOutline().renderSidebarChapters();

            // 全部绘制完成，再显示完整的菜单
            model.dom().wrap.removeClass( CLS_HIDE );

            // 最后更新菜单的高度
            this.updateLayout();

            return this;
        },
        renderSidebarOutline: function () {
            var model = this.model,
                elements = model.dom(),
                $wrap = elements.wrap,
                $footer = elements.footer,
                $body = $( document.body );

            if ( model.get( 'isAnchorsOnly' ) ) {
                return this;
            }

            // 绘制head
            $footer.append( elements.switcher ).append( elements.top );

            // 绘制body
            elements.body.append( elements.list );

            // 绘制完整的导航
            $wrap.empty().append( elements.header ).append( elements.body ).append( $footer );

            // 将导航和遮罩层添加到页面
            $body.append( $wrap ).append( elements.overlay );

            if ( !model.get( 'isAnimateScroll' ) ) {
                $body.attr( 'id', 'top' );
            }

            return this;
        },
        renderSidebarChapters: function () {
            var model = this.model;

            if ( !model.get( 'isAnchorsOnly' ) ) {
                this.renderChapters( model.dom().list );
            }

            return this;
        },
        renderChapters: function ( list ) {
            var model = this.model,
                $list = $( list ),
                chapters = model.chapters();

            $list.empty();

            $( chapters ).each( function ( i, chapter ) {
                var pid = chapter.pid,
                    id = chapter.id,
                    headingId = CLS_HEADING + '-' + id,
                    $parent = null,
                    $chapter = $( model.get( 'CHAPTER' ) ),
                    $code = $( model.get( 'CODE' ) ),
                    $text = $( model.get( 'TEXT' ) ),
                    chapterCode,
                    chapterIndex,
                    $subjects,
                    linkId,
                    chapterId,
                    subjectId,
                    parentId;

                if ( $list.hasClass( CLS_ARTICLE_CHAPTERS ) ) {
                    linkId = ARTICLE_PREFIX + CLS_TEXT + '-' + id;
                    chapterId = ARTICLE_PREFIX + CLS_CHAPTER + '-' + id;
                    subjectId = ARTICLE_PREFIX + CLS_SUBJECTS + '-' + pid;
                    parentId = ARTICLE_PREFIX + CLS_CHAPTER + '-' + pid;
                }
                else {
                    linkId = CLS_TEXT + '-' + id;
                    chapterId = CLS_CHAPTER + '-' + id;
                    subjectId = CLS_SUBJECTS + '-' + pid;
                    parentId = CLS_CHAPTER + '-' + pid;
                }

                $subjects = $( '#' + subjectId );

                // 创建菜单的链接
                $text.attr( {
                    id: linkId,
                    href: '#' + headingId,
                    rel: headingId
                } ).html( chapter.text );

                // 创建菜单项
                $chapter.attr( {
                    'id': chapterId,
                    'title': chapter.text
                } ).append( $text );

                // 一级标题直接创建标题链接即可
                if ( chapter.pid === -1 ) {

                    $list.append( $chapter );
                    chapterIndex = $chapter.index() + 1;
                    chapterCode = chapterIndex;

                }
                else {

                    // 子级的标题，需要找到上级章节
                    $parent = $( '#' + parentId );

                    // 没有绘制子菜单，则绘制它
                    if ( !$subjects[ 0 ] ) {
                        $subjects = $( model.get( 'SUBJECTS' ) ).attr( 'id', subjectId );

                        $parent.append( $subjects );
                    }

                    $subjects.append( $chapter );

                    // 绘制章节索引
                    chapterIndex = $chapter.index() + 1;
                    chapterCode = $parent.find( '.' + CLS_CODE ).html() + '.' + chapterIndex;
                }

                // 绘制段落章节编码
                $code.attr( 'data-chapter', chapterCode ).html( chapterCode );
                $code.insertBefore( $text );
            } );

            return this;
        },
        show: function () {
            var elements = this.model.dom(),
                $wrap = elements.wrap;

            elements.overlay.removeClass( CLS_HIDE );

            $wrap.animate( {
                left: 0
            }, 150, function () {
                $wrap.addClass( CLS_SHOW );
            } );

            return this;
        },
        hide: function () {
            var elements = this.model.dom(),
                $wrap = elements.wrap;

            $wrap.animate( {
                left: -300
            }, 150, function () {
                elements.overlay.addClass( CLS_HIDE );
                $wrap.removeClass( CLS_SHOW );
            } );

            return this;
        },
        toggle: function () {

            if ( this.model.dom().wrap.hasClass( CLS_SHOW ) ) {
                this.hide();
            }
            else {
                this.show();
            }

            return this;
        },
        updateLayout: function () {
            var elements = this.model.dom(),
                wrapHeight = elements.wrap[ 0 ].offsetHeight,
                headerHeight = elements.header[ 0 ].offsetHeight;

            elements.body.height( wrapHeight - headerHeight );

            return this;
        },
        scrollTo: function ( top ) {
            var self = this;

            $( "html,body" )
                .animate( {
                    scrollTop: top
                }, 500, 'linear', function () {
                    self.hide();
                } );

            return this;
        },
        destroy: function () {
            var model = this.model,
                elements = model.dom(),
                $anchors = model.anchors(),
                $headings = elements.headings,
                $article = elements.article,
                $chapters = elements.chapters,
                $wrap = elements.wrap,
                $overlay = elements.overlay;

            $article.off();

            $chapters.remove();

            $( $headings ).each( function ( i, heading ) {
                var $heading = $( heading ),
                    $code = $heading.find( '.' + CLS_CODE );

                $heading.removeClass( CLS_HEADING ).removeAttr( 'id' );
                $code.remove();

                $anchors[ i ].remove();
            } );

            $wrap.off().remove();

            $overlay.off().remove();

            $( window ).off( 'resize', this.onWindowResize );

            return this;
        }
    };

    AutocJS.Controller = function ( model, view ) {
        this.model = null;
        this.view = null;

        if ( isObject( model ) && isObject( view ) ) {
            this.initialize( model, view );
        }

        return this;
    };
    AutocJS.Controller.prototype = {
        version: '1.0.1',
        initialize: function ( model, view ) {

            if ( isObject( model ) ) {
                this.model = model;
            }

            if ( isObject( view ) ) {
                this.view = view;
            }

            return this;
        },
        trigger: function () {
            var self = this,
                model = this.model,
                data = {
                    context: self
                },
                elements,
                $article;

            elements = model.dom();
            $article = elements.article;

            // 鼠标滑过标题，显示标题的 AutocJS 链接
            $article.delegate( '.' + CLS_HEADING, 'mouseenter', data, this.onHeadingMouseEnter );

            // 鼠标离开标题，隐藏标题的 AutocJS 链接
            $article.delegate( '.' + CLS_HEADING, 'mouseleave', data, this.onHeadingMouseLeave );

            if ( model.get( 'hasDirectoryInArticle' ) ) {
                $article.delegate( '.' + CLS_TEXT, 'click', data, this.onArticleChapterClick );
            }

            if ( !model.get( 'isAnchorsOnly' ) ) {

                // 点击目录标题，隐藏/显示目录导航
                elements.switcher.on( 'click', data, this.onSwitcherClick );

                // 点击TOP链接，返回页面顶部
                elements.top.on( 'click', data, this.onTopClick );

                // 点击导航，定位文章，收起导航
                elements.list.delegate( '.' + CLS_TEXT, 'click', data, this.onSidebarChapterClick );

                // 点击遮罩层，收起导航
                elements.overlay.on( 'click', data, this.onOverlayClick );

                $( window ).on( 'resize', data, this.onWindowResize );
            }

            return this;
        },
        onHeadingMouseEnter: function ( evt ) {
            var context = evt.data.context,
                $anchor = $( this ).find( '.' + CLS_ANCHOR );

            $anchor.removeClass( CLS_HIDE );

            return context;
        },
        onHeadingMouseLeave: function ( evt ) {
            var context = evt.data.context,
                $anchor = $( this ).find( '.' + CLS_ANCHOR );

            $anchor.addClass( CLS_HIDE );

            return context;
        },
        /**
         * 文章开始处文章导航链接的 click 事件处理器。点击链接时，滚动定位到相应的段落开始位置。
         *
         * @param {Event} evt - Event 对象
         * @returns {AutocJS}
         */
        onArticleChapterClick: function ( evt ) {
            var context = evt.data.context,
                isAnimateScroll = context.get( 'isAnimateScroll' ),
                $chapter = $( '#' + $( this ).attr( 'rel' ) );

            if ( isAnimateScroll ) {
                context.view.scrollTo( $chapter[ 0 ].offsetTop );

                evt.stopPropagation();
                evt.preventDefault();
            }

            return context;
        },
        /**
         * 侧边栏菜单的展开/收起按钮的 click 事件处理器。点击后会根据菜单展开状态，展开或收起，并且隐藏遮罩层。
         *
         * @param {Event} evt - Event 对象
         * @returns {AutocJS}
         */
        onSwitcherClick: function ( evt ) {
            var context = evt.data.context;

            context.view.toggle();

            evt.stopPropagation();
            evt.preventDefault();

            return context;
        },
        /**
         * 侧边栏菜单的返回顶部按钮菜单的 click 事件处理器。点击后会滚动到页面顶部，并且隐藏遮罩层，收起菜单。
         *
         * @param {Event} evt - Event 对象
         * @returns {AutocJS}
         */
        onTopClick: function ( evt ) {
            var context = evt.data.context,
                isAnimateScroll = context.get( 'isAnimateScroll' );

            if ( isAnimateScroll ) {
                context.view.scrollTo( 0 );

                evt.stopPropagation();
                evt.preventDefault();
            }
            else {
                context.hide();
            }

            return context;
        },
        /**
         * 侧边栏菜单的文章索引链接的 click 事件处理器。点击后会会滚动定位到文章相关章节标题的位置，并且隐藏遮罩层，收起菜单。
         *
         * @param {Event} evt - Event 对象
         * @returns {AutocJS}
         */
        onSidebarChapterClick: function ( evt ) {
            var context = evt.data.context,
                isAnimateScroll = context.model.get( 'isAnimateScroll' ),
                $chapter = $( '#' + $( this ).attr( 'rel' ) );

            if ( isAnimateScroll ) {
                context.view.scrollTo( $chapter[ 0 ].offsetTop );

                evt.stopPropagation();
                evt.preventDefault();
            }
            else {
                context.view.hide();
            }

            return context;
        },
        /**
         * 遮罩层的 click 事件处理器。点击后隐藏遮罩层，收起菜单。
         *
         * @param {Event} evt - Event 对象
         * @returns {AutocJS}
         */
        onOverlayClick: function ( evt ) {
            var context = evt.data.context;

            context.view.hide();

            evt.stopPropagation();
            evt.preventDefault();

            return context;
        },
        /**
         * 窗口的 resize 事件处理器。窗口大小变更后，将立即更新侧边栏高度。
         *
         * @param {Event} evt - Event 对象
         * @returns {AutocJS}
         */
        onWindowResize: function ( evt ) {
            var context = evt.data.context;

            context.updateLayout();

            return context;
        }
    };

    AutocJS.defaults = {
        // 页面中显示文章正文的 DOM 节点或者 ID 选择器
        article: '',
        // 标题标签的选择器，默认值：'h1,h2,h3,h4,h5,h6'
        selector: SELECTOR,
        // AutocJS 自动创建的导航菜单标题文字，默认值：'Table of Contents'
        title: 'Table of Contents',
        // 是否只创建标题链接，默认值：false
        isAnchorsOnly: false,
        // 是否使用动画滚动定位，默认值：true
        isAnimateScroll: true,
        // 是否在文章中创建目录导航，默认值：false
        hasDirectoryInArticle: false,
        // 是否在文章标题中显示该标题的段落索引编号，默认值：false
        hasChapterCodeAtHeadings: false,
        // 标题标签中创建的标题链接的 HTML 模板代码
        ANCHOR: ANCHOR,
        // AutocJS 菜单根节点的 HTML 模板代码
        WRAP: WRAP,
        // AutocJS 菜单标题栏的 HTML 模板代码
        HEADER: HEADER,
        // AutocJS 菜单内容节点的 HTML 模板代码
        BODY: BODY,
        // AutocJS 菜单页脚节点的 HTML 模板代码
        FOOTER: FOOTER,
        // AutocJS 菜单展开显示开关的 HTML 模板代码
        SWITCHER: SWITCHER,
        // AutocJS 菜单返回顶部按钮的 HTML 模板代码
        TOP: TOP,
        // AutocJS 导航目录列表的 HTML 模板代码
        CHAPTERS: CHAPTERS,
        // AutocJS 导航子目录列表的 HTML 模板代码
        SUBJECTS: SUBJECTS,
        // AutocJS 导航段落章节的 HTML 模板代码
        CHAPTER: CHAPTER,
        // AutocJS 导航段落章节链接的 HTML 模板代码
        TEXT: TEXT,
        // AutocJS 段落章节索引编码的 HTML 模板代码
        CODE: CODE,
        // AutocJS 菜单展开时遮罩层的 HTML 模板代码
        OVERLAY: OVERLAY
    };

    AutocJS.stripScripts = stripScripts;
    AutocJS.encodeHTML = encodeHTML;
    AutocJS.decodeHTML = decodeHTML;
    AutocJS.safetyHTML = safetyHTML;
    AutocJS.template = template;
    AutocJS.guid = guid;

    // 将 autoc 扩展为一个 jquery 插件
    $.extend( $.fn, {
        autoc: function ( options ) {
            var $article = $( this ),
                config = {};

            $.extend( config, options, {
                article: $article
            } );

            return new AutocJS( config );
        }
    } );

    window.AutocJS = AutocJS;

    return AutocJS;
} ));