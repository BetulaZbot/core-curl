const IS_WIN = typeof self !== 'undefined' && self.self === self
const isFunction = cb => typeof cb === 'function'
const postMessage = require('./lib/postMessage')
const loaders = require('./lib/loader')
class Model {

    constructor({ loader, engine }) {
        this.loaders = loaders
        this.callback = []
        this.concurrency = 2
        const create = this.loaders[loader]
        this.$engine = typeof create === 'function' && create(engine) || (() => Promise.resolve({}))
    }
    createCallbacker(...arg) {
        return new Promise(resolve => {
            this.callback.push({
                params: [...arg],
                callback: resolve
            })
            if (this.callback.length > 0) {
                this.startCurl()
            }
        })
    }
    // 控制并发量，默认为 - 2
    startCurl() {
        if (this.callback.length === 0) {
            return
        }
        let list = []
        let callback = []
        for (let i = 0; i < this.concurrency; i++) {
            let item = this.callback.shift()
            list.push(this.$engine(...item.params))
            callback.push(item.callback)
            if (this.callback.length === 0) {
                break
            }
        }
        // console.log({list, callback})
        const instance = Promise.all(list)
        instance.then((result) => {
            // console.log({result})
            for (let i = 0; i < result.length; i++) {
                const cb = callback[i]
                const res = result[i]
                isFunction(cb) && cb(res)
            }
            return this.startCurl()
        }).catch((e) => {
            // console.log(e)
            let res = {}
            for (let i = 0; i < result.length; i++) {
                const cb = callback[i]
                isFunction(cb) && cb(res)
            }
            return this.startCurl()
        })
    }
    curl(...arg) {
        if (!IS_WIN) {
            return this.$engine(...arg)
        }
        const [{ dataType }] = [...arg]
        if (/postMessage/.test(dataType)) {
            return postMessage(...arg)
        }
        return this.createCallbacker(...arg)
    }
}

module.exports = config => new Model(config)