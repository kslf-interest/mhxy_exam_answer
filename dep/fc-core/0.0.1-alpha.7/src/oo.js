/**
 * @ignore
 * @file OO相关的方法集，类的创建 & 继承
 *
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {
    'use strict';

    var _ = require('underscore');
    var assert = require('./assert');
    var oo = require('eoo');

    /**
     * OO相关的方法，基于eoo简易封装
     * @class oo
     * @singleton
     */
    var exports = {};

    /**
     * 生成一个类
     * @param {Object=} overrides 可选的prototype方法（包括构造函数）
     * @return {Class} 生成的类
     */
    exports.create = function (overrides) {
        return oo.create(overrides);
    };

    /**
     * 继承一个类派生成一个子类，并指定子类的prototype方法（包括构造函数）
     * 直接使用oo处理
     * @param {Class} superClass 要被继承的类
     * @param {Object} overrides 子类的prototype方法（包括构造函数）
     * @return {Class} 继承之后的子类
     */
    exports.derive = function(superClass, overrides) {

        assert.has(superClass, 'fc.oo.derive使用时必须指定`superClass`参数！');
        assert.equals(
            _.isObject(overrides) || overrides === undefined,
            true,
            '错误的fc.oo.derive参数，传入的`overrides`必须是一个Object'
        );

        return oo.create(superClass, overrides);
    };

    return exports;
});
