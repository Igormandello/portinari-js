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
      window.addEventListener('keydown', this._onKeyDown);
      window.addEventListener('keyup', this._onKeyUp);
    }
  }

  get pressedKeys() {
    return this._pressedKeys.map(obj => obj.key);
  }

  get axis() {
    let horizontal = 0, vertical = 0;
    if (this._pressedKeys.some(obj => obj.keycode === Keys.A.keycode || obj.keycode === Keys.LEFT.keycode))
      horizontal = -1;
    else if (this._pressedKeys.some(obj => obj.keycode === Keys.D.keycode || obj.keycode === Keys.RIGHT.keycode))
      horizontal = 1;

    if (this._pressedKeys.some(obj => obj.keycode === Keys.W.keycode || obj.keycode === Keys.UP.keycode))
      vertical = -1;
    else if (this._pressedKeys.some(obj => obj.keycode === Keys.S.keycode || obj.keycode === Keys.DOWN.keycode))
      vertical = 1;

    return {
      horizontal,
      vertical
    }
  }

  isPressed(key) {
    if (typeof key === 'number')
      return this._pressedKeys.some(obj => obj.keycode == key);
    else if (typeof key === 'string')
      return this._pressedKeys.some(obj => obj.key == key.toUpperCase());
  }

  _onKeyDown(event) {
    if (!this._pressedKeys.some(obj => obj.keycode === event.keycode)) {
      this._pressedKeys.push({
        keycode: event.keycode,
        key: event.key.toUpperCase()
      });

      this._keyCallback(Object.assign({
        type: 'keydown'
      }, event));
    }
  }

  _onKeyUp(event) {
    let index = this._pressedKeys.findIndex(obj => obj.keycode === event.keycode);
    if (index >= 0)
      this._pressedKeys.splice(index, 1);

    this._keyCallback(Object.assign({
      type: 'keyup'
    }, event));
  }
}

module.exports = Input;