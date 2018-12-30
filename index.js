'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameEngine = function () {
  function GameEngine(ratio, targetFPS) {
    var _this = this;

    _classCallCheck(this, GameEngine);

    this._ratio = 16 / 9;
    this._fps = 60;
    this._updateList = [];

    if (ratio && typeof ratio == 'number') this._ratio = ratio;

    if (targetFPS && typeof targetFPS == 'number') this._fps = targetFPS;

    this._msGoal = 1000 / this._fps;
    if (typeof window !== 'undefined') this._animationFrame = window.requestAnimationFrame;else this._animationFrame = function (fn) {
      return setTimeout(fn, _this._msGoal);
    };
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
    key: 'start',
    value: function start() {
      if (!this._animationFrame || typeof this._animationFrame != 'function') return false;

      if (!this._running) {
        this._running = true;
        this._lastTime = Date.now();
        this._animationFrame(this._update.bind(this));
      }

      return true;
    }
  }, {
    key: '_update',
    value: function _update(time) {
      if (!time) time = Date.now();

      var delta = time - this._lastTime;
      this._lastTime = time;

      var ratio = 1 / (this._msGoal / delta);
      this._updateList.forEach(function (obj) {
        return obj.fn(ratio);
      });

      if (!this._stop) this._animationFrame(this._update.bind(this));else {
        this._running = false;
        this._stop = false;
      }
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (this._running) this._stop = true;
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
