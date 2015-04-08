/**
 * @file
 *
 * @author Leo Wang(leowang721@gmail.com)
 */

define(function (require) {
    // var _ = require('underscore');
    // var fc = require('fc-core');
    var Promise = require('fc-core/Promise');

    return {
        get: function (key) {
            return new Promise(function (resolve, reject) {
                try {
                    chrome.storage.local.get(key, function (result) {
                        resolve(result);
                    });
                }
                catch(e) {
                    reject(e);
                }
            });
        },
        set: function (key, value) {
            var item = {};
            if (typeof key !== 'string') {
                item = key;
            }
            else {
                item[key] = value;
            }
            return new Promise(function (resolve, reject) {
                try {
                    chrome.storage.local.set(item, function (result) {
                        resolve(result);
                    });
                }
                catch(e) {
                    reject(e);
                }
            });
        },
        remove: function (key) {
            return new Promise(function (resolve, reject) {
                try {
                    chrome.storage.local.remove(key, function (result) {
                        resolve(result);
                    });
                }
                catch(e) {
                    reject(e);
                }
            });
        },
        clear: function () {
            return new Promise(function (resolve, reject) {
                try {
                    chrome.storage.local.clear(function () {
                        resolve();
                    });
                }
                catch(e) {
                    reject(e);
                }
            });
        }
    };
});
