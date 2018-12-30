class GameEngine {
  constructor(ratio) {
    this._ratio = 16 / 9;

    if (ratio && typeof ratio == 'number')
      this._ratio = ratio;
  }

  get ratio() {
    return this._ratio;
  }
}

module.exports = GameEngine;