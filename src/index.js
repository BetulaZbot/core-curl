const IS_WIN = typeof self !== 'undefined' && self.self === self
const isFunction = cb => typeof cb === 'function'
const postMessage = require('./lib/postMessage')
const loaders = require('./lib/loader')


const RequestDecorator = require('./controlMax')


class Model {

    constructor({ loader, engine, maxLimit }) {
        this.loaders = loaders
        this.callback = []
        this.concurrency = 2
        const create = this.loaders[loader]
        this.$engine = typeof create === 'function' && create(engine) || (() => Promise.resolve({}))
        this.requestInstance = new RequestDecorator({
            maxLimit: maxLimit || 5,
            requestApi: this.$engine
        });
    }

    curl(...arg) {
        if (!IS_WIN) {
            return this.$engine(...arg)
        }
        const [{ dataType }] = [...arg]
        if (/postMessage/.test(dataType)) {
            return postMessage(...arg)
        }
        return this.requestInstance.request(...arg)
    }
}

module.exports = config => new Model(config)

