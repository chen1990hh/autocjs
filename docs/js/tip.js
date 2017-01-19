(function (global, factory) {
    'use strict';

    if (typeof module === 'object' && typeof module.exports === 'object') {

        // For CommonJS and CommonJS-like environments where a proper `window` is present
        module.exports = global.document ?
            factory(global, true) :
            function (w) {
                if (!w.document) {
                    throw new Error('Tip requires a window with a document');
                }
                return factory(w);
            };
    } else {
        // CMD (Register as an anonymous module)
        if ('function' == typeof define && define.cmd) {
            define(function (require, exports, module) {
                module.exports = factory(global, require('jquery'));
            });
        }
        else {
            // AMD
            if (typeof define === 'function' && define.amd) {
                define('tip', ['jquery'], factory(global, $));
            }
            else {
                factory(global, jQuery);
            }
        }
    }
// Pass this if window is not defined yet
})(typeof window !== 'undefined' ? window : this, (function (window, $, noGlobal) {
    'use strict';

    var HTML_CHARS = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;',
            '`': '&#x60;'
        }, _uid = -1,
        SCRIPT_FRAGMENT = '<script[^>]*>([\\S\\s]*?)<\/script\\s*>',
        CLS_HIDE = 'tip-hidden';

    /**
     * 生成唯一ID，结果如: build-0
     *
     * @param {String} [prefix] - 生成ID的前缀
     * @returns {string}
     */
    function guid(prefix) {
        var id;

        _uid += 1;
        id = prefix ? prefix + '-' + _uid : _uid;

        return id;
    }

    /**
     * 移除字符串中的危险 script 代码
     *
     * @param {String} html - (html)字符串
     * @returns {string}
     */
    function stripScripts(html) {
        return html.replace(new RegExp(SCRIPT_FRAGMENT, 'img'), '');
    }

    /**
     * 转义HTML代码
     *
     * @param {String} html - (html)字符串
     * @returns {string}
     */
    function encodeHTML(html) {
        html = '' + html;

        return stripScripts(html).replace(/[\r\t\n]/g, ' ').replace(/[&<>"'\/`]/g, function (match) {
            return HTML_CHARS[match];
        });
    }

    /**
     * 恢复被转义的HTML代码
     *
     * @param {String} html - (html)字符串
     * @returns {string}
     */
    function decodeHTML(html) {
        return html.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, '\'').replace(/&#x2F;/g, '\/').replace(/&#x60;/g, '`');
    }

    /**
     * 使用 JSON 对象格式数据替换HTML模板片段中的特殊字符，生成一段 HTML 模板字符串
     *
     * @param {Object} json - JSON 对象格式的数据
     * @param {String} html - 包含特殊字符的 HTML 模板片段
     * @returns {string|*}
     */
    function tmpl(json, html) {
        html = '' + html;

        $.each(json, function (key, value) {
            html = html.replace(new RegExp('{' + key + '}', 'ig'), decodeHTML(encodeHTML(value)));
        });

        return html;
    }

    var Tip = function (config) {

        this.attributes = {};

        this.target = null;
        this.wrap = null;
        this.content = null;

        this.set(Tip.defaults);

        if ($.isPlainObject(config)) {
            this.init(config);
        }

        return this;
    };

    Tip.defaults = {
        position: '',
        TIP_WRAP: '<div class="tip-wrap {position} ' + CLS_HIDE + '" id="tip-{id}"></div>',
        TIP_CONTENT: '<div class="tip-content">{content}</div>'
    };

    Tip.prototype = {
        version: '0.1.0',
        constructor: Tip,
        set: function (config) {
            if ($.isPlainObject(config)) {
                $.extend(this.attributes, config);
            }

            return this;
        },
        init: function (config) {
            this.set(config)._init().render().attachEvents();

            return this;
        },
        _init: function () {
            var attrs = this.attributes,
                $target = $(attrs.target),
                position = attrs.position || $target.attr("data-position") || "bottom-center",
                config = {
                    id: guid()
                };

            this.target = $target;

            config.position = position ? 'tip-' + position.toLocaleLowerCase() + "-wrap" : 'tip-bottom-center-wrap';

            this.wrap = $(tmpl(config, attrs.TIP_WRAP));

            this.content = $(tmpl({
                content: attrs.tip || $target.attr("data-tip") || $target.attr("title")
            }, attrs.TIP_CONTENT));

            return this;
        },
        render: function () {

            $(document.body).append(this.wrap.append(this.content));

            return this;
        },
        show: function () {
            this.wrap.removeClass(CLS_HIDE);

            this.resize().updatePosition();

            return this;
        },
        hide: function () {
            this.wrap.off().addClass(CLS_HIDE);

            return this;
        },
        resize: function () {
            this.wrap.width(this.content[0].offsetWidth).height(this.content[0].offsetHeight);
            return this;
        },
        updatePosition: function () {
            var $target = $(this.target),
                targetHeight = $target[0].offsetHeight,
                targetWidth = $target[0].offsetWidth,
                $wrap = this.wrap,
                wrapHeight = $wrap.height(),
                wrapWidth = $wrap.width(),
                left = $target.offset().left,
                top = $target.offset().top,
                position = this.attributes.position || $target.attr("data-position") || "bottom-center",
                cssAttr;

            switch (position.toLocaleLowerCase()) {
                case 'top-left':
                    cssAttr = {
                        left: left,
                        top: top - wrapHeight - 8
                    };
                    break;
                case 'top':
                case 'top-center':
                    cssAttr = {
                        left: left + ((targetWidth - wrapWidth) / 2),
                        top: top - wrapHeight - 8
                    };
                    break;
                case 'top-right':
                    cssAttr = {
                        left: left + (targetWidth - wrapWidth),
                        top: top - wrapHeight - 8
                    };
                    break;
                case 'right':
                    cssAttr = {
                        left: left + targetWidth + 8,
                        top: top + ((targetHeight - wrapHeight) / 2)
                    };
                    break;
                case 'bottom-left':
                    cssAttr = {
                        left: left,
                        top: top + targetHeight + 8
                    };
                    break;
                case 'bottom':
                case 'bottom-center':
                    cssAttr = {
                        left: left + ((targetWidth - wrapWidth) / 2),
                        top: top + targetHeight + 8
                    };
                    break;
                case 'bottom-right':
                    cssAttr = {
                        left: left + (targetWidth - wrapWidth),
                        top: top + targetHeight + 8
                    };
                    break;
                case 'left':
                    cssAttr = {
                        left: left - wrapWidth - 8,
                        top: top + ((targetHeight - wrapHeight) / 2)
                    };
                    break;
                default:
                    cssAttr = {
                        left: left + ((targetWidth - wrapWidth) / 2),
                        top: top + targetHeight + 8
                    };
                    break;
            }

            $wrap.css(cssAttr);

            return this;
        },
        attachEvents: function () {
            var self = this,
                $target = this.target;

            $target.on("mouseenter", function (evt) {
                self.show();

                evt.stopPropagation();
                evt.preventDefault();
            });

            $target.on("mouseleave", function () {
                self.hide();
            });

            return this;
        }
    };

    $.fn.extend({
        tip: function (config) {
            var tips = [];

            $(this).each(function (i, target) {
                if (!$.isPlainObject(config)) {
                    config = {};
                }

                config.target = target;

                tips.push(new Tip(config));
            });

            return tips;
        }
    });

    if (!noGlobal) {
        window.Tip = Tip;
    }

    return Tip;
}));