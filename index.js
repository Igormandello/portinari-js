'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameEngine = function () {
  function GameEngine(ratio, targetFPS) {
    _classCallCheck(this, GameEngine);

    this._ratio = 16 / 9;
    this._fps = 60;
    this._updateList = [];

    if (ratio && typeof ratio == 'number') this._ratio = ratio;

    if (targetFPS && typeof targetFPS == 'number') this._fps = targetFPS;
  }

  _createClass(GameEngine, [{
    key: 'addUpdateComponent',
    value: function addUpdateComponent(fn, label) {
      if (!fn || typeof fn !== 'function') fn = function fn() {};

      if (label) {
        var index = this._updateList.findIndex(function (obj) {
          return obj.label === label;
        });

        if (index >= 0) this._updateList[index].fn = fn;else this._updateList.push({ label: label, fn: fn, active: true });
      }
    }
  }, {
    key: 'removeUpdateComponent',
    value: function removeUpdateComponent(label) {
      var index = this._updateList.findIndex(function (obj) {
        return obj.label === label;
      });

      if (index >= 0) this._updateList.splice(index, 1);
    }
  }, {
    key: 'toggleUpdateComponent',
    value: function toggleUpdateComponent(label) {
      var index = this._updateList.findIndex(function (obj) {
        return obj.label === label;
      });

      if (index >= 0) this._updateList[index].active = !this._updateList[index].active;
    }
  }, {
    key: 'ratio',
    get: function get() {
      return this._ratio;
    }
  }, {
    key: 'fps',
    get: function get() {
      return this._fps;
    }
  }, {
    key: 'updateListLength',
    get: function get() {
      return this._updateList.length;
    }
  }, {
    key: 'activeUpdateComponents',
    get: function get() {
      return this._updateList.reduce(function (arr, obj) {
        if (obj.active) arr.push(obj.label);

        return arr;
      }, []);
    }
  }]);

  return GameEngine;
}();

module.exports = GameEngine;
