const assert = require('assert');
const { GameEngine, Input, Keys } = require('../src/');

describe('Game Engine class tests', () => {
  let ge;
  describe('constructing', () => {
    it('should keep the parameters', () => {
      ge = new GameEngine({
        ratio: 1,
        fps: 30
      });
      assert.equal(ge.ratio, 1);
      assert.equal(ge.fps, 30);
    });

    it('should set the ratio to 16/9 and fps to 60 by default', () => {
      ge = new GameEngine();
      assert.equal(ge.ratio, 16 / 9);
      assert.equal(ge.fps, 60);
    });

    it('should set the ratio to 16/9 and fps to 60 due to invalid parameters', () => {
      ge = new GameEngine({
        ratio: 'invalid',
        fps: 'invalid'
      });
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
      ge = new GameEngine({ ratio: 100 });

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
});

describe('Input class tests', () => {
  let input;
  describe('constructing', () => {
    it('should throw an error with there is no callback function', () => {
      assert.throws(() => {
        input = new Input();
      });
    });

    it('should throw an error with the parameter is not a function', () => {
      assert.throws(() => {
        input = new Input();
      });
    });

    it('should not throw any error with a callback function', () => {
      assert.doesNotThrow(() => {
        input = new Input(() => true);
      });
    });
  });

  describe('checking if the callback is being called', () => {
    let a, timesCalled;
    before(() => {
      a = 0;
      timesCalled = 0;

      input = new Input(evt => {
        if (evt.type == 'keydown' && evt.keyCode == 65)
          a++;
        else if (evt.type == 'keyup' && evt.keyCode == 66)
          a += 2;

        timesCalled++;
      });
    });

    it('should have not called the callback yet', () => {
      assert.equal(timesCalled, 0);
      assert.equal(a, 0);
    });

    it('should call the keydown event with the correct keycode', () => {
      input._onKeyDown(Keys.A);

      assert.equal(timesCalled, 1);
      assert.equal(a, 1);
    });

    it('should call the keyup event with the correct keycode', () => {
      input._onKeyUp({
        keyCode: 66,
        key: 'B'
      });

      assert.equal(timesCalled, 2);
      assert.equal(a, 3);
    });
  });

  describe('isPressed checks', () => {
    before(() => {
      input = new Input(() => true);
    });

    it('should not have any keys pressed', () => {
      assert.equal(input.pressedKeys.length, 0);
    });

    it('should returns true to key "A", "a" or to keycode 65', () => {
      input._onKeyDown(Keys.A);

      assert.equal(input.isPressed('A'), true);
      assert.equal(input.isPressed('a'), true);
      assert.equal(input.isPressed(65), true);
    });

    it('should only have the A key in pressedKeys array', () => {
      assert.equal(input.pressedKeys.length, 1);
      assert.equal(input.pressedKeys[0], 'A');
    });

    it('should returns false after the A key was released and the pressed keys array must be empty', () => {
      input._onKeyUp(Keys.A);

      assert.equal(input.isPressed('A'), false);
      assert.equal(input.isPressed('a'), false);
      assert.equal(input.isPressed(65), false);
      assert.equal(input.pressedKeys.length, 0);
    });
  });

  describe('axis checks', () => {
    beforeEach(() => {
      input = new Input(() => true);
    });

    it('should have the value 0 in both axis', () => {
      assert.equal(input.axis.horizontal, 0);
      assert.equal(input.axis.vertical, 0);
    });

    it('should have the value -1 both in vertical and horizontal after pressing the "W" and "A" key', () => {
      input._onKeyDown(Keys.W);
      input._onKeyDown(Keys.A);

      assert.equal(input.axis.horizontal, -1);
      assert.equal(input.axis.vertical, -1);
    });

    it('should have the value 1 both in vertical and horizontal after pressing the "S" and "D" key', () => {
      input._onKeyDown(Keys.S);
      input._onKeyDown(Keys.D);

      assert.equal(input.axis.horizontal, 1);
      assert.equal(input.axis.vertical, 1);
    });

    it('should have the value -1 both in vertical and horizontal after pressing the "ArrowUp" and "ArrowLeft" key', () => {
      input._onKeyDown(Keys.UP);
      input._onKeyDown(Keys.LEFT);

      assert.equal(input.axis.horizontal, -1);
      assert.equal(input.axis.vertical, -1);
    });

    it('should have the value 1 both in vertical and horizontal after pressing the "ArrowDown" and "ArrowRight" key', () => {
      input._onKeyDown(Keys.DOWN);
      input._onKeyDown(Keys.RIGHT);

      assert.equal(input.axis.horizontal, 1);
      assert.equal(input.axis.vertical, 1);
    });
  });
});