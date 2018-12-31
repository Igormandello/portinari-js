const assert = require('assert');
const { GameEngine } = require('../');

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

describe('adding update components', () => {
  before(() => {
    ge = new GameEngine();
  });

  it('should have 0 elements in the update list', () => {
    assert.equal(ge.updateListLength, 0);
  });

  it('should add 2 elements to the update list', () => {
    ge.addUpdateComponent(undefined, 'first');
    ge.addUpdateComponent(undefined, 'second');

    assert.equal(ge.updateListLength, 2);
  });

  it('should remove only the element with the "first" label', () => {
    ge.removeUpdateComponent('first');
    assert.equal(ge.updateListLength, 1);
    assert.equal(ge.activeUpdateComponents[0], 'second');
  });
});

describe('update components running', () => {
  let a = 0;
  before(() => {
    ge = new GameEngine(100);

    ge.addUpdateComponent(() => {
      if (a == 0)
       a += 2;
    }, 'first');

    ge.addUpdateComponent(() => {
      if (a == 2)
       a++;
    }, 'second');

    ge.addUpdateComponent(() => {
      if (a == 3)
       a++;
    }, 'third');

    ge.toggleUpdateComponent('second');
  });

  it('should not have started yet', () => {
    assert.equal(a, 0);
  });

  it('should run the only the first and last updates', resolve => {
    assert.equal(ge.start(), true);

    setTimeout(() => {
      ge.stop();
      assert.equal(a, 2);
      resolve();
    }, 20);
  });

  it('should toggle the second update and run it', resolve => {
    assert.equal(ge.start(), true);
    ge.toggleUpdateComponent('second');

    setTimeout(() => {
      ge.stop();
      assert.equal(a, 4);
      resolve();
    }, 20);
  });
});