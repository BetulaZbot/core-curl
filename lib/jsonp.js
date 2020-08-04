"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

module.exports = function (_ref) {
  var url = _ref.url,
      data = _ref.data;
  return new Promise(function (resolve) {
    if (!url) throw new Error('url is necessary');
    var callback = 'CALLBACK' + Math.random().toString().substr(9, 18); // const callback = 'cb_callback'

    var JSONP = document.createElement('script');
    JSONP.setAttribute('type', 'text/javascript');
    var headEle = document.getElementsByTagName('head')[0];
    var ret = '';

    if (data) {
      if (typeof data === 'string') ret = '&' + data;else if (_typeof(data) === 'object') {
        for (var key in data) {
          ret += '&' + key + '=' + encodeURIComponent(data[key]);
        }
      }
      ret += '&_time=' + Date.now();
    }

    JSONP.src = "".concat(url, "?callback=").concat(callback).concat(ret);

    window[callback] = function (r) {
      resolve(r);
      headEle.removeChild(JSONP);
      delete window[callback];
    };

    headEle.appendChild(JSONP);
  });
};