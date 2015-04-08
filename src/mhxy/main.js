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

    require('etpl/tpl!./main.tpl');
    require('css!./style.css');

    var searchTimeout = null;
    function trySearch(e) {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        var value = $(e.target).val();
        searchTimeout = setTimeout(function () {
            var result = doSearch(value);
            showResult(result);
        }, 50);
    }

    function doSearch(query) {
        var result = [];
        _.each(answer, function (item) {
            if (item[0].indexOf(query) > -1) {
                result.push(item);
            }
        });
        return result;
    }

    function showResult(result) {
        var html = '';
        _.each(result, function (item) {
            html += '<tr><td>' + item[0] + '</td><td>' + item[1] + '</td></tr>';
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
