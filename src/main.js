class GameEngine {
  constructor(ratio, targetFPS) {
    this._ratio = 16 / 9;
    this._fps = 60;

    if (ratio && typeof ratio == 'number')
      this._ratio = ratio;

    if (targetFPS && typeof targetFPS == 'number')
      this._fps = targetFPS;
  }

  get ratio() {
    return this._ratio;
  }

  get fps() {
    return this._fps;
  }
}

module.exports = GameEngine;