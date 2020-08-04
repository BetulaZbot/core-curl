"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var IS_WIN = typeof self !== 'undefined' && self.self === self;

var isFunction = function isFunction(cb) {
  return typeof cb === 'function';
};

var postMessage = require('./lib/postMessage');

var loaders = require('./lib/loader');

var RequestDecorator = require('./controlMax');

var Model = /*#__PURE__*/function () {
  function Model(_ref) {
    var loader = _ref.loader,
        engine = _ref.engine,
        maxLimit = _ref.maxLimit;

    _classCallCheck(this, Model);

    this.loaders = loaders;
    this.callback = [];
    this.concurrency = 2;
    var create = this.loaders[loader];

    this.$engine = typeof create === 'function' && create(engine) || function () {
      return Promise.resolve({});
    };

    this.requestInstance = new RequestDecorator({
      maxLimit: maxLimit || 5,
      requestApi: this.$engine
    });
  }

  _createClass(Model, [{
    key: "curl",
    value: function curl() {
      var _this$requestInstance;

      for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
        arg[_key] = arguments[_key];
      }

      if (!IS_WIN) {
        return this.$engine.apply(this, arg);
      }

      var _ref2 = [].concat(arg),
          dataType = _ref2[0].dataType;

      if (/postMessage/.test(dataType)) {
        return postMessage.apply(void 0, arg);
      }

      return (_this$requestInstance = this.requestInstance).request.apply(_this$requestInstance, arg);
    }
  }]);

  return Model;
}();

module.exports = function (config) {
  return new Model(config);
};