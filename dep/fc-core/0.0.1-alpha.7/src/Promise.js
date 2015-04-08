/**
 * @file 增强过的符合ES6模式的Promise
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {
    'use strict';

    /**
     * 当前直接使用ecomfe/promise库
     * @class Promise
     */
    var Promise = require('promise');

    // 但是进行一下特性的fix，因为例如cast在Chrome中又没了
    /**
     * 将 value 转化为 标准的 Promise 对象， 当 value 已经为 标准Promise 对象时，直接返回 value，
     * 其他情况等价于 Promise.resolve(object)
     *
     * @static
     * @member Promise
     * @param {*} value 要转化的值
     * @return {Promise}
     */
    Promise.cast = Promise.cast || function (value) {
        if (value && typeof value === 'object' && value.constructor === this) {
            return value;
        }

        return new Promise(function (resolve) {
            resolve(value);
        });
    };

    // 修复Promise.require
    /**
     * 返回一个{@link meta.Promise}对象，
     * 当指定的模块被AMD加载器加载后，进入`resolved`状态
     *
     * @param {string[]} modules 需要加载的模块列表
     * @return {meta.Promise}
     * @static
     */
    function promiseRequire(modules) {
        // 这个函数不实现 node 版本了，没啥意义。。
        var abort;
        var promise = new this(
            function (resolve, reject) {
                window.require(modules, resolve);
                abort = reject;
            }
        );
        promise.abort = abort;
        return promise;
    }

    Promise.require = promiseRequire;

    return Promise;
});
