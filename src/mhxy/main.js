/**
 * @file
 *
 * @author Leo Wang(leowang721@gmail.com)
 */

define(function (require) {
    var _ = require('underscore');
    var etpl = require('etpl');
    var answer = require('./answer');
    var $ = require('jquery');
    var getCharactor = require('./getCharactor');

    require('etpl/tpl!./main.tpl');
    require('css!./style.css');

    // 准备个缓存吧，这样更快一些
    // 将二维数组转为这样的格式：
    // [
    //     {
    //         q: '问题',
    //         a: '答案',
    //         c: 'wt'
    //     }
    // ]

    var toSearch = _.map(answer, function (item) {
        return {
            q: item[0],
            a: item[1],
            c: getCharactor(item[0])
        };
    });


    var searchTimeout = null;
    function trySearch(e) {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        var value = $(e.target).val().trim();
        searchTimeout = setTimeout(function () {
            var result = doSearch(value);
            showResult(result);
        }, 50);
    }

    function doSearch(query) {
        var result = [];
        _.each(toSearch, function (item) {
            if (item.q.indexOf(query) > -1 || isAviableCharactors(query.toUpperCase(), item.c)) {
                result.push(item);
            }
        });
        return result;
    }

    function isAviableCharactors(query, c) {
        return _.some(c, function (eachC) {
            return eachC.indexOf(query) > -1;
        });
    }

    function showResult(result) {
        var html = '';
        _.each(result, function (item) {
            html += '<tr><td>' + item.q + '</td><td>' + item.a + '</td></tr>';
        });
        if (!html) {
            html = '<tr><td colspan="2">暂无答案</td></tr>';
        }
        $('#result-tbody').html(html);
    }

    return {
        activate: function () {
            var renderer = etpl.getRenderer('mhxy-keju');
            $('#main').html(renderer());
            $('#query').on('input', trySearch);
            showResult(doSearch(''));
        }
    };
});
