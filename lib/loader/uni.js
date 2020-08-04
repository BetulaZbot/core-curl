'use strict';

module.exports = function (uni) {
  return function (_ref) {
    var url = _ref.url,
        methods = _ref.methods,
        data = _ref.data,
        dataType = _ref.dataType,
        headers = _ref.headers;
    return new Promise(function (resolve) {
      //dataType如果设为 json，会尝试对返回的数据做一次 JSON.parse
      uni.request({
        url: url,
        data: data,
        dataType: dataType,
        header: headers,
        method: methods,
        success: resolve,
        fail: function fail() {
          return resolve({});
        }
      });
    });
  };
};