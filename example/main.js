let ge = new GameEngine(document.getElementById('cnv'), 16 / 9, 1);

ge.addUpdateComponent((ctx, ratio) => {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, ge.canvas.width, ge.canvas.height);
}, 'mainUpdate');

ge.addUpdateComponent((ctx, ratio, frameCount) => {
  if (frameCount % 2) {
    ctx.fillStyle = '#009999';
    ctx.fillRect(ge.canvas.width / 4, ge.canvas.height / 4, ge.canvas.width / 2, ge.canvas.height / 2);
  }
}, 'secondaryUpdate');

ge.start();