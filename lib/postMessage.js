"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var prefix = '_FLIGHT_PREFIX_';

module.exports = function (params) {
  return new Promise(function (resolve) {
    var _ref = params || {},
        timeout = _ref.timeout,
        postMessage = _ref.postMessage,
        data = _ref.data,
        url = _ref.url,
        methods = _ref.methods;

    var $date = new Date();
    var key = "".concat(prefix).concat($date.getTime());
    var $body = document.querySelector('body');
    var $iframe = document.createElement('iframe');
    $iframe.setAttribute('style', 'display:none');
    $iframe.setAttribute('name', "".concat(key, "_NAME"));
    $iframe.setAttribute('id', "".concat(key, "_ID"));
    $body.appendChild($iframe);
    var $form = document.createElement('form');
    $form.setAttribute('target', "".concat(key, "_NAME"));
    $form.setAttribute('method', methods && methods.toUpperCase() || 'POST');
    $form.setAttribute('action', url);
    $body.appendChild($form);
    Object.keys(data || {}).forEach(function (name) {
      var $input = document.createElement('input');
      $input.setAttribute('type', 'hidden');
      $input.setAttribute('name', name);
      $input.setAttribute('value', JSON.stringify(data[name]));
      $form.appendChild($input);
    });
    var target, name;

    if (typeof postMessage === 'string') {
      name = postMessage;
    } else if (_typeof(postMessage) === 'object') {
      target = postMessage.target;
      name = postMessage.name;
    }

    target = target || window.parent;
    var addEventListener, removeEventListener, message;

    if (target.addEventListener) {
      addEventListener = target.addEventListener;
      removeEventListener = target.removeEventListener;
      message = 'message';
    } else {
      addEventListener = target['attachEvent'];
      removeEventListener = target['deattachEvent'];
      message = 'onmessage';
    }

    var loadState = false;

    var func = function func(e) {
      if (typeof e.data !== 'string') {
        return;
      }

      var _e$data$split = e.data.split('#'),
          _e$data$split2 = _slicedToArray(_e$data$split, 3),
          type = _e$data$split2[0],
          state = _e$data$split2[1],
          data = _e$data$split2[2];

      if (type !== name) {
        return;
      }

      if (!state) {
        return;
      }

      if (loadState === true) {
        return;
      }

      loadState = true;
      removeEventListener(message, func);

      try {
        data = JSON.parse(data);
      } catch (e) {
        data = {};
      }

      return resolve(data);
    };

    addEventListener(message, func, false);
    $form.submit();

    if (timeout !== 0 && timeout) {
      var timer = setTimeout(function () {
        clearTimeout(timer);
        loadState = true;

        if (!loadState) {
          'warn' in console && console.warn("\u63A5\u53E3[".concat(url, "]\u8D85\u65F6(").concat(timeout, "s)"));
          return resolve({});
        }
      }, timeout);
    }
  });
};