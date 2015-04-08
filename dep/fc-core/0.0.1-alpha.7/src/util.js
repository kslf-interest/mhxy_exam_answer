/**
 * @ignore
 * @file 一些公共的工具方法
 *
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {
    'use strict';

    var _ = require('underscore');

    /**
     * 工具方法集合
     * @class util
     */
    var util = {
        warnDeprecated: function (msg) {
            /* eslint-disable */
            console.warn('%c' + msg, 'color: #ef9c2f');
            /* eslint-enable */
        }
    };

    /**
     * Generates a random GUID legal string of the given length.
     * @param {number} len 要生成串的长度
     * @return {string} 指定长度的16进制数随机串
     */
    function rand16Num(len) {
        len = len || 0;
        var result = [];
        for (var i = 0; i < len; i++) {
            result.push('0123456789abcdef'.charAt(
                Math.floor(Math.random() * 16))
            );
        }
        return result.join('');
    }

    /**
     * 生成一个全局唯一的guid，且格式符合guid规范
     * GUID 的格式为“xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx”
     * 其中每个 x 是 0-9 或 a-f 范围内的一个32位十六进制数
     * 第四版的GUID使用了新的算法，其产生的数字是一个伪随机数。
     * 它生成的GUID的第三组数字的第一位是4
     *
     * @return {string} 符合guid格式的字符串
     */
    util.guid = function() {
        var curr = (new Date()).valueOf().toString();
        return ['4b534c46',  // Fixed first group. and a trick
                rand16Num(4),
                '4' + rand16Num(3),  // The first character of 3rd group is '4'.
                rand16Num(4),
                curr.substring(0, 12)].join('-');
    };

    /**
     * 生成一个唯一性的unique id串，在这里认为是guid的mini版本，并不是uuid
     * 保证因素：按照时间粒度的唯一性
     * so 生成算法是在当前时间戳的基础上增加随机数的方式
     *
     * @return {string} 一个16位的随机字符串
     */
    util.uid = function () {
        return [
            (new Date()).valueOf().toString(),  // 取前12位
            rand16Num(4)
        ].join('');
    };

    var search = window.location.search.substring(1);
    /**
     * 错误处理
     * @param {Error|Object|Event|string} ex 错误信息
     */
    util.processError = (window.DEBUG || /\bdebug\b/g.test(search)
        ? function (ex) {
            if (ex instanceof Error) {
                window.console.error(ex.stack);
            }
            else if (ex.error instanceof Error || _.isArray(ex.error)) {
                util.processError(ex.error);
            }
            else if (_.isArray(ex)) {
                _.each(ex, util.processError);
            }
            else if (ex instanceof require('mini-event/Event')
                && ex.type === 'error') {
                window.console.error(ex.error.failType, ex.error.reason, ex);
            }
            else {
                window.console.error(ex);
            }
        }
        : _.noop
    );

    /**
     * 将一段Object类型的配置中符合etpl语法的变量替换为传入的数据中的值
     * 并返回替换后的Object值
     *
     * @param {Object} conf 要被替换的Object类型配置
     * @param {Object} data 数据
     * @return {Object} 替换后的新配置
     */
    function mixWith (conf, data) {
        return JSON.parse(require('etpl').compile(JSON.stringify(conf))(data));
    }

    /**
     * 暴露混合数据修正配置的方法
     * @method
     */
    util.mixWith = mixWith;

    /**
     * 对于fire中的自定义数据进行封装，统一封装到event.data中
     * 因为自定义事件的参数是如此使用：
     * fire(type, event) ?
     *     如果event不是Object
     *         则fire的参数为 {data:event, type:type, target:source}
     *     如果直接有onsth处理方法，不是on('sth')注册的
     *         则fire的参数为 event，需要注意这种情况
     *     如果是Object
     *         则fire的参数为，补充了type和target的event
     *
     * 因此，我们限制自定义参数的使用，为{ data: data }
     * 结合着自动补充的type和target，最终为
     * {
     *     data: data,
     *     type: type,
     *     target: source
     * }
     * @param {!Object} data 要使用的数据
     * @return {Object} 用于自定义事件使用的参数
     */
    util.customData = function (data) {
        return {
            data: data
        };
    };

    return util;
});
