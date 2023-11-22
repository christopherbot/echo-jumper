import { Player } from '@src/entities'

import BaseScene from './BaseScene'

class Game extends BaseScene {
  private player!: Phaser.GameObjects.Sprite

  constructor() {
    super('game')
  }

  preload() {}

  create() {
    this.drawGrid({
      x: 0,
      y: 0,
      width: this.gameWidth,
      height: this.gameHeight,
    })

    this.add
      .text(
        this.middleX,
        this.middleY - 100,
        this.gameTitle,
        this.gameTitleStyle,
      )
      .setOrigin(0.5, 0.5)
      .setPadding(5)

    this.player = new Player(this, 300, 650, '')
  }

  update() {
    this.player.update()
  }
}

export default Game
