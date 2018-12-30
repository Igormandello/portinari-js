class GameEngine {
  constructor(ratio, targetFPS) {
    this._ratio = 16 / 9;
    this._fps = 60;
    this._updateList = [];

    if (ratio && typeof ratio == 'number')
      this._ratio = ratio;

    if (targetFPS && typeof targetFPS == 'number')
      this._fps = targetFPS;

    this._msGoal = 1000 / this._fps;
    if (typeof window !== 'undefined')
      this._animationFrame = window.requestAnimationFrame;
    else
      this._animationFrame = fn => setTimeout(fn, this._msGoal);
  }

  get ratio() {
    return this._ratio;
  }

  get fps() {
    return this._fps;
  }

  get updateListLength() {
    return this._updateList.length;
  }

  get activeUpdateComponents() {
    return this._updateList.reduce((arr, obj) => {
      if (obj.active)
        arr.push(obj.label);

      return arr;
    }, []);
  }

  addUpdateComponent(fn, label) {
    if (!fn || typeof fn !== 'function')
      fn = () => {};

    if (label) {
      let index = this._updateList.findIndex(obj => obj.label === label);

      if (index >= 0)
        this._updateList[index].fn = fn;
      else
        this._updateList.push({ label, fn, active: true });
    }
  }

  removeUpdateComponent(label) {
    let index = this._updateList.findIndex(obj => obj.label === label);
    
    if (index >= 0)
      this._updateList.splice(index, 1);
  }

  toggleUpdateComponent(label) {
    let index = this._updateList.findIndex(obj => obj.label === label);
    
    if (index >= 0)
      this._updateList[index].active = !this._updateList[index].active;
  }

  start() {
    if (!this._animationFrame || typeof this._animationFrame != 'function')
      return false;
      
    if (!this._running) {
      this._running = true;
      this._lastTime = Date.now();
      this._animationFrame(this._update.bind(this));
    }

    return true;
  }

  _update(time) {
    if (!time)
      time = Date.now();
      
    let delta = time - this._lastTime;
        this._lastTime = time;

    let ratio = 1 / (this._msGoal / delta);
    this._updateList.forEach(obj => obj.fn(ratio));

    if (!this._stop)
      this._animationFrame(this._update.bind(this));
    else {
      this._running = false;
      this._stop = false;
    }
  }

  stop() {
    if (this._running)
      this._stop = true;
  }
}

module.exports = GameEngine;