class GameEngine {
  constructor(ratio, targetFPS) {
    this._ratio = 16 / 9;
    this._fps = 60;
    this._updateList = [];

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
}

module.exports = GameEngine;