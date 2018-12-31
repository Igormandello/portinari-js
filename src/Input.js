const Keys = require('./Keys');

class Input {
  constructor(keyCallback) {
    this._pressedKeys = [];
    this._keyCallback = () => true;

    if (keyCallback)
      if (typeof keyCallback === 'function')
        this._keyCallback = keyCallback;
      else
        throw 'The callback parameter must be a function';
    else
      throw 'The callback function is required'

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this._onKeyDown.bind(this));
      window.addEventListener('keyup', this._onKeyUp.bind(this));
    }
  }

  get pressedKeys() {
    return this._pressedKeys.map(obj => obj.key);
  }

  get axis() {
    let horizontal = 0, vertical = 0;
    if (this._pressedKeys.some(obj => obj.keyCode === Keys.A.keyCode || obj.keyCode === Keys.LEFT.keyCode))
      horizontal = -1;
    else if (this._pressedKeys.some(obj => obj.keyCode === Keys.D.keyCode || obj.keyCode === Keys.RIGHT.keyCode))
      horizontal = 1;

    if (this._pressedKeys.some(obj => obj.keyCode === Keys.W.keyCode || obj.keyCode === Keys.UP.keyCode))
      vertical = -1;
    else if (this._pressedKeys.some(obj => obj.keyCode === Keys.S.keyCode || obj.keyCode === Keys.DOWN.keyCode))
      vertical = 1;

    return {
      horizontal,
      vertical
    }
  }

  isPressed(key) {
    if (typeof key === 'number')
      return this._pressedKeys.some(obj => obj.keyCode == key);
    else if (typeof key === 'string')
      return this._pressedKeys.some(obj => obj.key == key.toUpperCase());
  }

  _onKeyDown(event) {
    if (!this._pressedKeys.some(obj => obj.keyCode === event.keyCode)) {
      this._pressedKeys.push({
        keyCode: event.keyCode,
        key: event.key.toUpperCase()
      });

      this._keyCallback(Object.assign({
        type: 'keydown'
      }, event));
    }
  }

  _onKeyUp(event) {
    let index = this._pressedKeys.findIndex(obj => obj.keyCode === event.keyCode);
    if (index >= 0)
      this._pressedKeys.splice(index, 1);

    this._keyCallback(Object.assign({
      type: 'keyup'
    }, event));
  }
}

module.exports = Input;