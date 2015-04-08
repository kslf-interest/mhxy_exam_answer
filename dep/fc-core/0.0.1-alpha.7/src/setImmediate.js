/**
 * @file setImmediate
 *
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {
    var _ = require('underscore');

    /**
     * setImmediate的封装
     * IE10~11下window.setImmediate如果使用时的this值得不是window，就会抛出异常
     * @class setImmediate
     */
    if (require('./browser').getBrowser() === 'IE' && window.setImmediate) {
        window.setImmediate = _.bind(window.setImmediate, window);
    }
    return _.bind(require('promise/setImmediate'), window);
});
