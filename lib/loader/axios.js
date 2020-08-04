'use strict';

var jsonp = require('../jsonp');

module.exports = function (axios) {
  return function (_ref) {
    var url = _ref.url,
        data = _ref.data,
        methods = _ref.methods,
        headers = _ref.headers,
        dataType = _ref.dataType;

    if (dataType && dataType.toUpperCase() === 'JSONP') {
      return jsonp({
        url: url,
        data: data
      });
    }

    methods = methods || 'get';
    axios.defaults.withCredentials = false; // cookie跨域

    return new Promise(function (resolve, reject) {
      var axiosConfig = {
        method: methods,
        url: url,
        headers: headers || {},
        data: data.data,
        params: data.params,
        responseType: dataType
      };
      return axios(axiosConfig).then(function (res) {
        return resolve(res.data);
      })["catch"](reject);
    });
  };
};