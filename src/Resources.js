const path = require('path');

class Resources {
  constructor(rootDir, images) {
    let remaining = images.length;
    let imageLoaded = () => {
      remaining--;
      
      if (remaining <= 0 && this.onload && typeof this.onload === 'function')
        this.onload();
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
}

module.exports = Resources;