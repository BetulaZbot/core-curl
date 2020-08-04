'use strict'
const jsonp = require('../jsonp')
module.exports = axios => ({ url, data, methods, headers, dataType }) => {
    if (dataType && dataType.toUpperCase() === 'JSONP') {
        return jsonp({ url, data })
    }
    methods = methods || 'get'
    axios.defaults.withCredentials = false // cookie跨域
    return new Promise((resolve, reject) => {
        let axiosConfig = {
            method: methods,
            url,
            headers: headers || {},
            data: data.data,
            params: data.params,
            responseType:dataType
        }

        return axios(axiosConfig).then(res => resolve(res.data)).catch(reject)
    })
}