const assert = require('assert');
const GameEngine = require('../index.js');

let ge;
describe('constructing', () => {
  it('should keep the parameter ratio', () => {
    ge = new GameEngine(1);
    assert.equal(ge.ratio, 1);
  });

  it('should set the ratio to 16/9 by default', () => {
    ge = new GameEngine();
    assert.equal(ge.ratio, 16 / 9);
  });

  it('should set the ratio to 16/9 to an invalid ratio', () => {
    ge = new GameEngine('string');
    assert.equal(ge.ratio, 16 / 9);
  });
});