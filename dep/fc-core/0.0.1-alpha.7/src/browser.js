/**
 * @file Provide the basic browser enviroment information, such as
 *    - user agent
 *    - browser shell
 *    - OS system
 *    - flash
 *    - user screen dimension
 *
 * @author Zhifen Lin(linzhifen@baidu.com)
 * @author Lijie Chen(chenlijie@baidu.com)
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {

    /**
     * The object to be exported.
     */
    var clientInfo = {};

    /**
     * The string for unknown UA, OS, etc.
     *
     * @type {string}
     */
    var UNKNOWN = 'other';

    /**
     * The data cache of the browser. Keyed by clientInfo.KEY.
     *
     * @type {Object}
     */
    var browserData = {};

    /**
     * parse user agent
     * @param {string} rawUa user agent info
     * @return {string} The simplifiled version of user agent. Return 'other'
     *      if we can't parse it.
     */
    function parseUserAgent(rawUa) {
        var version = rawUa.match(
                /(IE|Trident|Firefox|Opera|Chrome|Safari)[ \/](\d+(\.\d+)?)/i);
        if (version && version[0]) {
            return version[0];
        }
        return UNKNOWN;
    }

    /**
     * determine is ie
     * @param {string} rawUa user agent info
     * @return {boolean} Return true if it's one kind of IE browser.
     */
    function isIe(rawUa) {
        return rawUa.indexOf('IE') !== -1 || rawUa.indexOf('Trident/7.0') !== -1;
    }

    /**
     * Return the shell name if it's an IE browser,
     * or return 'null' if it's not an IE.
     * @param {string} rawUa user agent info
     * @return {string} Return the shell name if it's an IE browser,
     *     or return 'null' if it's not an IE.
     */
    function parseIeShell(rawUa) {
        if (isIe(rawUa)) {
            var shell = rawUa.slice(rawUa.lastIndexOf(';') + 2,
                                    rawUa.length - 1);
            return /Trident|Windows NT|\.NET/.test(shell)
                ? 'IE' : shell;
        }
        return 'null';
    }

    /**
     * parse os info
     * @param {string} rawUa user agent info
     * @return {string} os info
     */
    function parseOs(rawUa) {
        var result = rawUa.match(/(windows nt|macintosh|solaris|linux)/i);
        return result ? result[1] : UNKNOWN;
    }

    /**
     * parse client info
     * incluing client width, height
     * @return {string} client info
     */
    function parseClientResolution() {

        /**
         * format method
         * @param {number|string} w width
         * @param {number|string} h height
         * @return {string} string like 'width,height'
         */
        var format = function(w, h) {
            return w + ',' + h;
        };

        if (window.innerHeight) {
            return format(window.innerWidth, window.innerHeight);
        } else if (document.documentElement
                   && document.documentElement.clientHeight) {
            return format(document.documentElement.clientWidth,
                          document.documentElement.clientHeight);
        }
        return format(document.documentElement.clientWidth,
                      document.documentElement.clientHeight);
    }

    /**
     * parse flash version from window.navigator
     * @param {Object} navigator window.navigator
     * @return {number|string} flash version
     */
    function parseFlashVersion(navigator) {
        var f = 'ShockwaveFlash.ShockwaveFlash';
        var fla;
        if (navigator.plugins && navigator.mimeTypes.length) {
            // VarFlash_是flash的对象
            fla = navigator.plugins['Shockwave Flash'];
            if (fla && fla.description) {
                // 用正则去除所有的字母和空格
                return +fla.description.replace(/[^\d\.]/g, '').split('.')[0];
            }
        }
        else if (navigator.userAgent.toLowerCase().indexOf('ie') >= 0) {
            var A = ActiveXObject;
            fla = null;
            try {
                fla = new A(f + '.7');
            }
            catch (e) {
                try {
                    fla = new A(f + '.6');
                    fla.AllowScriptAccess = 'always';
                    return 6;
                }
                catch (ex) {}
                try {
                    fla = new A(f);
                }
                catch (ex) {}
            }
            if (fla) {
                try {
                    var toReturn = fla.GetVariable;
                    toReturn = toReturn('$version').split(' ')[1].split(',')[0];
                    return toReturn;
                }
                catch (e) {}
            }
        }
        return 0;
    }

    /**
     * Function to init all the variables.
     * @param {Object} navigator window.navigator
     * @param {Object} screen window.screen
     * @param {Object} history window.history
     */
    function initBrowserData(navigator, screen, history) {
        var rawUa = navigator.userAgent;
        var key = clientInfo.KEY;
        browserData[key.USER_AGENT] = parseUserAgent(rawUa);
        browserData[key.IE_SHELL] = parseIeShell(rawUa);
        browserData[key.OS] = parseOs(rawUa);
        browserData[key.PLATFORM] = navigator.platform;
        browserData[key.SCREEN_RESOLUTION] = screen.width + ',' + screen.height;
        browserData[key.CLIENT_RESOLUTION] = parseClientResolution();
        browserData[key.COLOR_DEPTH] = screen.colorDepth;
        browserData[key.FLASH] = parseFlashVersion(navigator);
        browserData[key.HISTORY_DEPTH] = history.length;
        browserData[key.PLUGIN_COUNT] = navigator.plugins.length;
        browserData[key.MIME_TYPE_COUNT] = navigator.mimeTypes.length;
        browserData[key.COOKIE_ENABLED] = navigator.cookieEnabled;
        browserData[key.LANGUAGE] =
            navigator.systemLanguage || navigator.language;
        browserData[key.BROWSER] = browserData[key.USER_AGENT].split(/[ /]/)[0];
        browserData[key.BROWSER_VERSION] =
            + browserData[key.USER_AGENT].split(/[ /]/)[1];

        // IE 11 特殊处理

        if (browserData[key.BROWSER] === 'Trident') {
            browserData[key.BROWSER] = 'IE';
            browserData[key.BROWSER_VERSION] = 11;
        }
    }

    /**
     * The const key definition of the browser's feature and info.
     *
     * @type {Object}
     */
    clientInfo.KEY = {
        USER_AGENT: 'nav',
        IE_SHELL: 'ies',
        OS: 'sys',
        PLATFORM: 'plt',
        SCREEN_RESOLUTION: 'swh',
        CLIENT_RESOLUTION: 'uwh',
        COLOR_DEPTH: 'scd',
        FLASH: 'flv',
        HISTORY_DEPTH: 'hil',
        PLUGIN_COUNT: 'pil',
        MIME_TYPE_COUNT: 'mil',
        COOKIE_ENABLED: 'coe',
        LANGUAGE: 'osl',
        BROWSER: 'bwr',
        BROWSER_VERSION: 'bwv'
    };

    /**
     * A public method to return the browser's UA and version.
     * For example:
     *  IE 10.0 for IE10
     *  IE 8.0 for IE8
     *  Chrome/29 for Chrome29
     *
     * The format depends on the specific UA string.
     *
     * @return {string} simple useragent info
     */
    clientInfo.getUserAgent = function() {
        return browserData[clientInfo.KEY.USER_AGENT];
    };

    /**
     * Returns true if flash is supported.
     * @return {boolean}
     */
    clientInfo.isFlashSupported = function() {
        return browserData[clientInfo.KEY.FLASH] > 0;
    };

    /**
     * Returns an object for almost all the browser's features.
     * See clientInfo.KEY for more details.
     * @return {Object} parsed browser data
     */
    clientInfo.getBrowserData = function() {
        return browserData;
    };

    /**
     * Returns the specific value by the given key.
     *
     * @param {string} key The key defined in clientInfo.KEY.
     * @return {string} defined key in clientInfo.KEY or undefined
     */
    clientInfo.getBrowserDataByKey = function(key) {
        return browserData[key];
    };

    /**
     * Returns browser's UserAgent
     * @return {string} simple browser as Chrome
     */
    clientInfo.getBrowser = function() {
        return browserData[clientInfo.KEY.BROWSER];
    };

    /**
     * Returns browser's UserAgent version
     * @return {number} simple browser's version
     */
    clientInfo.getBrowserVersion = function() {
        return browserData[clientInfo.KEY.BROWSER_VERSION];
    };

    /**
     * Only used in test to reset the necessary UA field for testing.
     */
    clientInfo.resetForTest = initBrowserData;

    initBrowserData(window.navigator, window.screen, window.history);

    return clientInfo;
});
