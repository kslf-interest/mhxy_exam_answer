/**
 * @ignore
 * @file AOP related modules.
 * Refer: http://en.wikipedia.org/wiki/Aspect-oriented_programming
 *
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {
    'use strict';

    /**
     * aop方法的namespace
     * @class aop
     * @singleton
     */
    var aop = {};

    /**
     * Injects the method called before the core method.
     *
     * @param {Object} context The obj that the method belongs to.
     * @param {string} methodName The name of the method in the context.
     * @param {Function} aspectMethod The method to be injected before
     *     the core method.
     */
    aop.before = function(context, methodName, aspectMethod) {
        if (!aspectMethod) {
            // Do nothing if the aspectMethod is invalid.
            return;
        }
        var original = context[methodName];
        context[methodName] = function() {
            // 为了防止前置出错
            try {
                aspectMethod.apply(this, arguments);
            }
            finally {
                return original.apply(this, arguments);
            }
        };
    };

    /**
     * Injects the method called before the core method
     * If the return value of the injected method is true，execute the core method
     *
     * @param {Object} context The obj that the method belongs to.
     * @param {string} methodName The name of the method in the context.
     * @param {Function} aspectMethod The method to be injected before
     *     the core method.
     */
    aop.beforeReject = function(context, methodName, aspectMethod) {
        if (!aspectMethod) {
            // Do nothing if the aspectMethod is invalid.
            return;
        }
        var original = context[methodName];
        context[methodName] = function() {
            if (aspectMethod.apply(this, arguments)) {
                return original.apply(this, arguments);
            }
        };
    };

    /**
     * Injects the method called after the core method.
     *
     * @param {Object} context The obj that the method belongs to.
     * @param {string} methodName The name of the method in the context.
     * @param {Function} aspectMethod The method to be injected after
     *     the core method.
     */
    aop.after = function(context, methodName, aspectMethod) {
        if (!aspectMethod) {
            // Do nothing if the aspectMethod is invalid.
            return;
        }
        var original = context[methodName];
        context[methodName] = function() {
            var result = original.apply(this, arguments);
            // 为了防止后置出错
            try {
                aspectMethod.apply(this, arguments);
            }
            finally {
                return result;
            }
        };
    };

    /**
     * Injects the methods called before and after the core method respectively.
     *
     * @param {Object} context The obj that the method belongs to.
     * @param {string} methodName The name of the method in the context.
     * @param {Function} beforeMethod The method to be injected before the core
     *     method.
     * @param {Function} afterMethod The method to be injected after the core
     *     method.
     */
    aop.around = function(context, methodName, beforeMethod, afterMethod) {
        aop.before(context, methodName, beforeMethod);
        aop.after(context, methodName, afterMethod);
    };

    return aop;
});
