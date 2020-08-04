'use strict';

module.exports = function ($) {
  return function (_ref) {
    var url = _ref.url,
        methods = _ref.methods,
        data = _ref.data,
        dataType = _ref.dataType,
        headers = _ref.headers,
        jsonp = _ref.jsonp;
    return new Promise(function (resolve) {
      $.ajax({
        url: url,
        data: data,
        dataType: dataType,
        headers: headers,
        type: methods,
        success: resolve,
        error: function error() {
          return resolve();
        },
        jsonp: jsonp,
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true
      });
    });
  };
};