'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GameEngine = function () {
  function GameEngine(ratio, targetFPS) {
    _classCallCheck(this, GameEngine);

    this._ratio = 16 / 9;
    this._fps = 60;

    if (ratio && typeof ratio == 'number') this._ratio = ratio;

    if (targetFPS && typeof targetFPS == 'number') this._fps = targetFPS;
  }

  _createClass(GameEngine, [{
    key: 'ratio',
    get: function get() {
      return this._ratio;
    }
  }, {
    key: 'fps',
    get: function get() {
      return this._fps;
    }
  }]);

  return GameEngine;
}();

module.exports = GameEngine;
