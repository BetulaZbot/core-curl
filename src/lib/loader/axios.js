'use strict'
const jsonp = require('../jsonp')
module.exports = axios => ({url, data, methods, headers, dataType, jsonp}) => {
    if(dataType && dataType.toUpperCase() === 'JSONP'){
        return jsonp({url, data, jsonp})
    }
    methods = methods || 'get'
    axios.defaults.withCredentials = true // cookie跨域
    return new Promise((resolve, reject) => {
        let axiosConfig = {
            method: methods,
            url,
            headers: headers || {}
        }
        if(methods.toUpperCase() === 'POST'){
            axiosConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded'
            axiosConfig.transformRequest =  [(data) => {
                data = data || {}
                let arr = []
                for (let it in data) {
                    let val = data[it]
                    val = Object.prototype.toString.apply(value) === '[object Object]' ? JSON.stringify(val) : val
                    arr.push(`${encodeURIComponent(it)}=${encodeURIComponent(val)}`)
                }
                return arr.join('&')
            }]
        }else{
            axiosConfig.data = data
        }
        return axios(axiosConfig).then(res => resolve(res.data)).catch(reject)
    })
}