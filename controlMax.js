"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RequestDecorator = /*#__PURE__*/function () {
  function RequestDecorator(_ref) {
    var _ref$maxLimit = _ref.maxLimit,
        maxLimit = _ref$maxLimit === void 0 ? 5 : _ref$maxLimit,
        requestApi = _ref.requestApi;

    _classCallCheck(this, RequestDecorator);

    // 最大并发量
    this.maxLimit = maxLimit; // 请求队列,若当前请求并发量已经超过maxLimit,则将该请求加入到请求队列中

    this.requestQueue = []; // 当前并发量数目

    this.currentConcurrent = 0; // // 使用者定义的请求api，若用户传入needChange2Promise为true,则将用户的callback类api使用pify这个库将其转化为promise类的。

    this.requestApi = requestApi;
  } // 发起请求api


  _createClass(RequestDecorator, [{
    key: "request",
    value: function () {
      var _request = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var result,
            _args = arguments;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(this.currentConcurrent >= this.maxLimit)) {
                  _context.next = 3;
                  break;
                }

                _context.next = 3;
                return this.startBlocking();

              case 3:
                _context.prev = 3;
                this.currentConcurrent++;
                _context.next = 7;
                return this.requestApi.apply(this, _args);

              case 7:
                result = _context.sent;
                return _context.abrupt("return", Promise.resolve(result));

              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](3);
                console.warn(_context.t0);
                return _context.abrupt("return", Promise.reject({}));

              case 15:
                _context.prev = 15;
                console.log('当前并发数:', this.currentConcurrent);
                this.currentConcurrent--;
                this.next();
                return _context.finish(15);

              case 20:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 11, 15, 20]]);
      }));

      function request() {
        return _request.apply(this, arguments);
      }

      return request;
    }() // 新建一个promise,并且将该reolsve函数放入到requestQueue队列里。
    // 当调用next函数的时候，会从队列里取出一个resolve函数并执行。

  }, {
    key: "startBlocking",
    value: function startBlocking() {
      var _resolve;

      var promise2 = new Promise(function (resolve, reject) {
        return _resolve = resolve;
      });
      this.requestQueue.push(_resolve);
      return promise2;
    } // 从请求队列里取出队首的resolve并执行。

  }, {
    key: "next",
    value: function next() {
      if (this.requestQueue.length <= 0) return;

      var _resolve = this.requestQueue.shift();

      _resolve();
    }
  }]);

  return RequestDecorator;
}();

module.exports = RequestDecorator;