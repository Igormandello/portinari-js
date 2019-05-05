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

### The Game Engine module
This module offers methods to create your canvas, sizing, ratio, FPS and updating it.

#### Usage
```javascript
const ge = new GameEngine([options])
```

- options
  - type: `Object`
  - The options for initializing the canvas and the GameEngine. Check out the [options](#options) below

### Options
#### ratio
  - Type: `number`
  - Default: `16 / 9`
  - The ratio of the canvas, it will try to grow as much as possible (e.g. if you set it to `1`, in a `1280x720` screen, the canvas will be set to `720x720`. In a `500x720` screen, the canvas will be set to `500x500`)

#### fullScreen
  - Type: `boolean`
  - Default: `false`
  - Sets the canvas size to full screen, this ignores the ratio property

#### fps
  - Type: `number`
  - Default: `60`
  - The target update rate, if set to 60, will try to use the `window.requestAnimationFrame`, otherwise, defaults to `setTimeout`

#### canvas
  - Type: `HTMLElement`
  - Default: `null`
  - The canvas instance that will be used. If `null`, a new canvas will be instanciated and appended to body

