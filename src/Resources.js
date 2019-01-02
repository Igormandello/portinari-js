const path = require('path');

class Resources {
  constructor(rootDir, images) {
    let remaining = images.length;
    let imageLoaded = () => {
      remaining--;
      
      if (remaining <= 0) {
        this._loaded = true;

        if (this._onload && typeof this._onload === 'function')
          this._onload();
      }
    }

    if (remaining == 0) {
      imageLoaded();
      return;
    }

    this._images = {};
    images.forEach(filename => {
      let img = new Image();
      img.onload = imageLoaded;

      img.src = path.join(rootDir, filename);
      this._images[filename] = img;
    });
  }

  get images() {
    return this._images;
  }

  get loaded() {
    return this._loaded;
  }

  set onload(fn) {
    this._onload = fn;

    if (this._loaded && typeof this._onload === 'function')
      this._onload();
  }
}

module.exports = Resources;