/**
 * @ignore
 * @file FC基础层 入口模块
 *
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {
    'use strict';

    /**
     * FC 基础层 入口模块
     * @class main
     */
    var fc = {
        version: '0.0.1.alpha.7',

        /**
         * aop相关的方法集
         * @type {Object}
         */
        aop: require('./aop'),

        /**
         * 断言相关的方法集
         * @type {Object}
         */
        assert: require('./assert'),

        /**
         * OO相关的方法集，类的创建 & 继承
         * @type {Object}
         */
        oo: require('./oo'),

        // 立即执行
        setImmediate: require('./setImmediate'),

        /**
         * TPL相关的方法集，当前直接使用etpl
         * @type {Object}
         */
        tpl: require('etpl'),

        /**
         * 扩展的工具方法集
         * @type {Object}
         */
        util: require('./util'),

        /**
         * 自定义事件的封装
         */
        event: require('mini-event')
    };

    fc.tpl.config({
        namingConflict: 'ignore'
    });

    // 扩展underscore
    require('./extension/underscore').activate();

    return fc;
});
