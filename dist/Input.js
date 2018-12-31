'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Keys = require('./Keys');

var Input = function () {
  function Input(keyCallback) {
    _classCallCheck(this, Input);

    this._pressedKeys = [];
    this._keyCallback = function () {
      return true;
    };

    if (keyCallback) {
      if (typeof keyCallback === 'function') this._keyCallback = keyCallback;else throw 'The callback parameter must be a function';
    } else throw 'The callback function is required';

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this._onKeyDown);
      window.addEventListener('keyup', this._onKeyUp);
    }
  }

  _createClass(Input, [{
    key: 'isPressed',
    value: function isPressed(key) {
      if (typeof key === 'number') return this._pressedKeys.some(function (obj) {
        return obj.keycode == key;
      });else if (typeof key === 'string') return this._pressedKeys.some(function (obj) {
        return obj.key == key.toUpperCase();
      });
    }
  }, {
    key: '_onKeyDown',
    value: function _onKeyDown(event) {
      if (!this._pressedKeys.some(function (obj) {
        return obj.keycode === event.keycode;
      })) {
        this._pressedKeys.push({
          keycode: event.keycode,
          key: event.key.toUpperCase()
        });

        this._keyCallback(Object.assign({
          type: 'keydown'
        }, event));
      }
    }
  }, {
    key: '_onKeyUp',
    value: function _onKeyUp(event) {
      var index = this._pressedKeys.findIndex(function (obj) {
        return obj.keycode === event.keycode;
      });
      if (index >= 0) this._pressedKeys.splice(index, 1);

      this._keyCallback(Object.assign({
        type: 'keyup'
      }, event));
    }
  }, {
    key: 'pressedKeys',
    get: function get() {
      return this._pressedKeys.map(function (obj) {
        return obj.key;
      });
    }
  }, {
    key: 'axis',
    get: function get() {
      var horizontal = 0,
          vertical = 0;
      if (this._pressedKeys.some(function (obj) {
        return obj.keycode === Keys.A.keycode || obj.keycode === Keys.LEFT.keycode;
      })) horizontal = -1;else if (this._pressedKeys.some(function (obj) {
        return obj.keycode === Keys.D.keycode || obj.keycode === Keys.RIGHT.keycode;
      })) horizontal = 1;

      if (this._pressedKeys.some(function (obj) {
        return obj.keycode === Keys.W.keycode || obj.keycode === Keys.UP.keycode;
      })) vertical = -1;else if (this._pressedKeys.some(function (obj) {
        return obj.keycode === Keys.S.keycode || obj.keycode === Keys.DOWN.keycode;
      })) vertical = 1;

      return {
        horizontal: horizontal,
        vertical: vertical
      };
    }
  }]);

  return Input;
}();

module.exports = Input;