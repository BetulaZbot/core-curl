'use strict'

module.exports = $ => ({url, methods, data, dataType, headers, jsonp}) => new Promise((resolve) => {
    $.ajax({
        url,
        data,
        dataType,
        headers,
        type: methods,
        success: resolve,
        error: () => resolve(),
        jsonp,
        xhrFields: {withCredentials: true},
        crossDomain: true,
    })
})