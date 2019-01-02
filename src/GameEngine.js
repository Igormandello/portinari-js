class GameEngine {
  constructor(opts) {
    this._updateList = [];
    this._animationList = [];
    this._framesToNextAnimation = -1;
    this._lastAnimationFrame = 0;
    this._frameCount = 0;
    this._options = {
      ratio: 16 / 9,
      fps: 60
    };

    if (opts && typeof opts === 'object') {
      if (opts.ratio && typeof opts.ratio !== 'number')
        delete opts.ratio

      if (opts.fps && typeof opts.fps !== 'number')
        delete opts.fps;

      if (opts.canvas && !opts.canvas instanceof HTMLElement)
        delete opts.canvas;

      if (opts.fullScreen) {
        delete this._options.ratio;

        if (opts.ratio)
          delete opts.ratio;
      }
    }

    Object.assign(this._options, opts);

    this._msGoal = 1000 / this._options.fps;
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      if (this._options.fps == 60)
        this._animationFrame = window.requestAnimationFrame.bind(window);

      if (!this._options.canvas)
        this._options.canvas = document.body.appendChild(document.createElement('canvas'));

      Object.assign(document.body.style, {
        margin: 0,
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
      });

      let w = document.body.clientWidth,
          h = document.body.clientHeight,
          canvas = this._options.canvas;
      canvas.width = w;
      canvas.height = h;
      canvas.style.alignSelf = 'center';
  
      if (!this._options.fullScreen)
        if (w * (1 / this._options.ratio) > h)
          canvas.width = h * this._options.ratio;
        else
          canvas.height = w * (1 / this._options.ratio);

      this._context = canvas.getContext('2d');
    } 
    
    if (typeof window === 'undefined' || this._options.fps != 60)
      this._animationFrame = fn => setTimeout(fn, this._msGoal);
  }

  get ratio() {
    return this._options.ratio;
  }

  get fps() {
    return this._options.fps;
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

  get canvas() {
    return this._options.canvas;
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

  addAnimationComponent(fn, frames, label) {
    if (!fn || typeof fn !== 'function')
      fn = () => {};

    if (label) {
      let index = this._animationList.findIndex(obj => obj.label === label);

      if (index >= 0) {
        this._animationList[index].fn = fn;
        this._animationList[index].frames = frames;
        this._animationList[index].remainingToAnimation = frames;
      } else
        this._animationList.push({
          label,
          fn,
          frames,
          remainingToAnimation: frames,
          active: true
        });

      if (frames < this._framesToNextAnimation || this._framesToNextAnimation < 0)
        this._framesToNextAnimation = frames;
    }
  }

  removeAnimationComponent(label) {
    let index = this._animationList.findIndex(obj => obj.label === label);
    
    if (index >= 0)
      this._animationList.splice(index, 1);

    if (this._animationList.length == 0)
      this._framesToNextAnimation = -1;
  }

  toggleAnimationComponent(label) {
    let index = this._animationList.findIndex(obj => obj.label === label);
    
    if (index >= 0) {
      this._animationList[index].active = !this._animationList[index].active;
      this._animationList[index].remainingToAnimation = this._animationList[index].frames;

      if (this._animationList[index].active && (frames < this._framesToNextAnimation || this._framesToNextAnimation < 0))
        this._framesToNextAnimation = this._animationList[index].frames;
    }

    if (!this._animationList.some(obj => obj.active))
      this._framesToNextAnimation = -1;
  }

  start() {
    if (!this._animationFrame || typeof this._animationFrame != 'function')
      return false;
      
    if (!this._running) {
      this._running = true;
      this._lastTime = Date.now();
      this._frameCount = 0;

      if (typeof window === 'undefined' || this._fps != 60)
        this._update();
      else
        this._animationFrame(this._update.bind(this));
    }

    return true;
  }

  _update(time) {
    this._frameCount++;
    this._animationUpdate();

    if (!time)
      time = Date.now();

    let delta = time - this._lastTime;
        this._lastTime = time;

    let ratio = 1 / (this._msGoal / delta);
    this._updateList.forEach(obj => {
      if (obj.active)
        obj.fn(this._context, ratio, this._frameCount);
    });

    if (!this._stop)
      this._animationFrame(this._update.bind(this));
    else {
      this._running = false;
      this._stop = false;
    }
  }

  _animationUpdate() {
    if (this._framesToNextAnimation == -1)
      return;

    if (this._framesToNextAnimation > 0)
      this._framesToNextAnimation--;

    if (this._framesToNextAnimation == 0) {
      let framesDelta = this._frameCount - this._lastAnimationFrame;
      this._lastAnimationFrame = this._frameCount;

      let nextAnimation = -1;
      this._animationList.forEach((obj, i, arr) => {
        if (obj.active) {
          arr[i].remainingToAnimation -= framesDelta;

          if (arr[i].remainingToAnimation == 0) {
            arr[i].remainingToAnimation = arr[i].frames;
            arr[i].fn();
          }

          if (arr[i].remainingToAnimation < nextAnimation || nextAnimation < 0)
            nextAnimation = arr[i].remainingToAnimation;
        }
      });

      this._framesToNextAnimation = nextAnimation;
    }
  }

  stop() {
    if (this._running)
      this._stop = true;
  }
}

module.exports = GameEngine;