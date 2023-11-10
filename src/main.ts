import 'phaser'

import HelloWorld from './scenes/HelloWorld'

const config: Phaser.Types.Core.GameConfig = {
  title: 'Github Game Off 2023',
  type: Phaser.AUTO,
  parent: 'app',
  width: 800,
  height: 600,
  backgroundColor: '#300000',
  scene: [HelloWorld],
  render: { pixelArt: false, antialias: true },
  canvasStyle: `margin: 0;`,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      debug: false,
    },
  },
  input: {
    keyboard: true,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    // `fullscreenTarget` must be defined for phones to not have
    // a small margin during fullscreen.
    fullscreenTarget: 'app',
    expandParent: false,
  },
}

const game = new Phaser.Game(config)

window.addEventListener('load', () => {
  // Expose `_game` to allow debugging, mute button and fullscreen button
  window._game = game
})

export default game
