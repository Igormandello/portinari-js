let ge = new GameEngine({
      ratio: 16 / 9,
      fps: 60
    }),
    res = new Resources('assets', [ 'foo.png' ]),
    input = new Input(() => true);

let greyBackground = true;
ge.addUpdateComponent((ctx) => {
  if (greyBackground)
    ctx.fillStyle = '#333';
  else
    ctx.fillStyle = '#000';

  ctx.fillRect(0, 0, ge.canvas.width, ge.canvas.height);
}, 'firstUpdate');

let imagePos = { x: 0, y: 0 }, speed = 5, playerVisible = true;
ge.addUpdateComponent((ctx, ratio) => {
  imagePos.x += input.axis.horizontal * speed;
  imagePos.y += input.axis.vertical * speed;

  if (playerVisible)
    ctx.drawImage(res.images['foo.png'], imagePos.x, imagePos.y);
}, 'secondUpdate');

let imageVisible = true;
ge.addUpdateComponent((ctx, ratio) => {
  if (imageVisible) {
    ctx.fillStyle = '#009999';
    ctx.fillRect(ge.canvas.width / 4, ge.canvas.height / 4, ge.canvas.width / 2, ge.canvas.height / 2);
  }
}, 'thirdUpdate');

ge.addAnimationComponent(() => {
  imageVisible = !imageVisible;
}, 25, 'imageAnimation');

ge.addAnimationComponent(() => {
  greyBackground = !greyBackground;
}, 50, 'backgroundAnimation');

ge.addAnimationComponent(() => {
  playerVisible = !playerVisible;
}, 100, 'playerAnimation');

res.onload = () => {
  ge.start();
}