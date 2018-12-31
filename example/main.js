let ge = new GameEngine(document.getElementById('cnv'), 16 / 9, 60),
    res = new Resources('assets', [ 'foo.png' ]),
    input = new Input(() => true);

ge.addUpdateComponent((ctx) => {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, ge.canvas.width, ge.canvas.height);
}, 'firstUpdate');

let imagePos = { x: 0, y: 0 }, speed = 5;
ge.addUpdateComponent((ctx, ratio) => {
  imagePos.x += input.axis.horizontal * speed;
  imagePos.y += input.axis.vertical * speed;

  ctx.drawImage(res.images['foo.png'], imagePos.x, imagePos.y);
}, 'secondUpdate');

ge.addUpdateComponent((ctx, ratio, frameCount) => {
  if (frameCount < 200) {
    ctx.fillStyle = '#009999';
    ctx.fillRect(ge.canvas.width / 4, ge.canvas.height / 4, ge.canvas.width / 2, ge.canvas.height / 2);
  }
}, 'thirdUpdate');

res.onload = () => {
  ge.start();
}