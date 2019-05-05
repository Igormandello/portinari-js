# Game Engine JS
The easiest, lightest and fastest way to start using canvas in Javascript.

## Start using it right now 
```bash
$ npm i game-engine-js
# or
$ yarn add game-engine-js
```

out of a node environment, import it directly from `node_modules`:
```html
<script src="node_modules/game-engine-js/dist/index.js"></script>
```

## Using `game-engine-js`
The package consists of 3 modules (so far): `GameEngine`, `Input` and `Resources`:

# The Game Engine module
This module provides methods to create your canvas, sizing, ratio, FPS and updating it.

### Usage
```js
const ge = new GameEngine([options])
```
- options
  - type: `Object`
  - The options for initializing the canvas and the GameEngine. Check out the [options](#options) below

## Options
### ratio
  - Type: `number`
  - Default: `16 / 9`
  - The ratio of the canvas, it will try to grow as much as possible (e.g. if you set it to `1`, in a `1280x720` screen, the canvas will be set to `720x720`. In a `500x720` screen, the canvas will be set to `500x500`)

### fullScreen
  - Type: `boolean`
  - Default: `false`
  - Sets the canvas size to full screen, **this ignores the ratio property**

### fps
  - Type: `number`
  - Default: `60`
  - The target update rate, if set to 60, will try to use the `window.requestAnimationFrame`, otherwise, defaults to `setTimeout`

### canvas
  - Type: `HTMLElement`
  - Default: `null`
  - The canvas instance that will be used. If `null`, a new canvas will be instanciated and appended to body

## Methods
### `addUpdateComponent(fn, label)`
Adds a new component to be called every frame.
- fn
  - Type: `function`
  - The callback component, has 3 parameters: `context`, `ratio` and `frameCount`. The `context` is the context of the canvas, use it do draw, `ratio` is the ratio of the current FPS to the target FPS, and `frameCount` is the number of frames elapsed since the engine started running.
- label
  - Type: `string`
  - A label to identify this updateComponent, will be used to remove or disable it.

#### Example
```js
ge.addUpdateComponent((ctx, ratio, frameCount) => {
  if (frameCount % 100 == 0) {
    if (ctx.fillStyle == '#999') {
      ctx.fillStyle = '#000'
    } else {
      ctx.fillStyle = '#999'
    }
  }

  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}, 'clearBackground')
```

if `fn` isn't a lambda function, `this` must be binded in order to access context variables:
```js
class Background {
  constructor() {
    this._backgroundColor = '#999'
  }

  clearBackground(ctx, ratio, frameCount) {
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  }
}

const background = new Background()
ge.addUpdateComponent(
  background.clearBackground.bind(background),
  'clearBackground'
)
```

### `removeUpdateComponent(label)`
Removes an updateComponent from the update list.
- label
  - Type: `string`
  - The label of the updateComponent that will be removed

### `toggleUpdateComponent(label)`
Toggles the state of an updateComponent, if its disabled, it won't be called in the next updates, but can be enabled again anytime with this same function.
- label
  - Type: `string`
  - The label of the updateComponent that will be toggled

### `addAnimationComponent(fn, frames, label)`
Adds a new animation to be called every `n` frames.
- fn
  - Type: `function`
  - The callback component to be called everytime the animation is triggered, doesn't have any parameters
- frames
  - Type: `number`
  - The number of frames between each call of the animation
- label
  - Type: `string`
  - A label to identify this animationComponent, will be used to remove or disable it.

#### Example
```js
const backgroundColor = '#000'
ge.addAnimationComponent(() => {
  if (backgroundColor == '#000') {
    backgroundColor = '#999'
  } else {
    backgroundColor ='#000'
  }
})

ge.addUpdateComponent((ctx) => {
  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}, 'clearBackground')
```

To use context variables, the same process of `addUpdateComponent` must be done.

### `removeAnimationComponent(label)`
Removes an animationComponent from the animation list.
- label
  - Type: `string`
  - The label of the animationComponent that will be removed

### `toggleAnimationComponent(label)`
Toggles the state of an animationComponent, if its disabled, it won't be called in the next animation triggers, but can be enabled again anytime with this same function. After enabling it, the number of frames to trigger it again will be reset.
- label
  - Type: `string`
  - The label of the animationComponent that will be toggled

### `start()`
Starts the Game Engine. While this function is not called, neither the updateComponents nor the animationComponents are triggered.
- (return)
  - Type: `boolean`
  - True if the Engine started, otherwise, false.

### `stop()`
Stops the Game Engine. Acts like a pause, when `start()` is called again, the state of the engine is kept.

## Getters
### ratio
- Type: `number`
- The ratio of the canvas

### fps
- Type: `number`
- The target frame rate of the engine

### activeUpdateComponents
- Type: `array`
- An array of all active update components

### canvas
- Type: `HTMLElement`
- The canvas being used by the engine

---

# The Input module
This module offers methods to handle the keyboard input

### Usage
```js
const input = new Input(fn)
```
- fn
  - Type: `function`
  - The function to be called when the input is updated, it receives the default JS event as a parameter. It is called whenever a keyUp or keyDown event is sent.

## Keys
The Keys object comes along the Input class, and it is used to map which keys are being pressed and it's useful to use as a parameter to `isPressed`

### Values
| Property   | keyCode | key        |
|------------|---------|------------|
| Keys.UP    | 38      | ArrowUp    |
| Keys.DOWN  | 40      | ArrowDown  |
| Keys.LEFT  | 37      | ArrowLeft  |
| Keys.RIGHT | 39      | ArrowRight |
| Keys.W     | 87      | W          |
| Keys.A     | 65      | A          |
| Keys.S     | 83      | S          |
| Keys.D     | 68      | D          |
| Keys.ENTER | 13      | Enter      |
| Keys.SPACE | 32      | ' '        |

### Example
```js
const input = new Input(evt => {
  if (evt.keyCode === Keys.SPACE.keyCode) {
    console.log('The state of Space changed!')
  }

  if (evt.keyCode === Keys.A.keyCode && evt.type === 'keydown') {
    console.log('The A key was pressed!')

    if (input.isPressed(Keys.S)) {
      console.log('S + A pressed!')
    }
  }
})
```

## Methods
### `isPressed(key)`
Checks whether the key is pressed
- key
  - Type: `number` or `string`
  - The identifier of the key to be checked. If it's number, the keyCode will be checked, if it's a string, the key char will be checked (not case-sensitive)

## Getters
### `pressedKeys`
- Type: `array`
- An array of all pressed keys

### `axis`
The state of each axis (horizontal and vertical), mapped between -1 and 1
- Type: `object`
- Properties:
  - horizontal: The state of the horizontal axis, -1 if 'LEFT_ARROW' or 'A' is pressed and 1 if 'RIGHT_ARROW' or 'D' is pressed.
  - vertical:  The state of the vertical axis, -1 if 'ARROW_UP' or 'W' is pressed and 1 if 'ARROW_DOWN' or 'S' is pressed.