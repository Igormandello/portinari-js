const assert = require('assert');
const GameEngine = require('../index.js');

let ge;
describe('constructing', () => {
  it('should keep the parameters', () => {
    ge = new GameEngine(1, 30);
    assert.equal(ge.ratio, 1);
    assert.equal(ge.fps, 30);
  });

  it('should set the ratio to 16/9 and fps to 60 by default', () => {
    ge = new GameEngine();
    assert.equal(ge.ratio, 16 / 9);
    assert.equal(ge.fps, 60);
  });

  it('should set the ratio to 16/9 and fps to 60 due to invalid parameters', () => {
    ge = new GameEngine('invalid', 'invalid');
    assert.equal(ge.ratio, 16 / 9);
    assert.equal(ge.fps, 60);
  });
});