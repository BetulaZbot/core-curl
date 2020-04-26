'use strict'

module.exports = uni => ({ url, methods, data, dataType, headers }) => new Promise((resolve) => {

    //dataType如果设为 json，会尝试对返回的数据做一次 JSON.parse
    uni.request({
        url,
        data,
        dataType,
        header: headers,
        method: methods,
        success: resolve,
        fail: () => resolve({}),
    });
})