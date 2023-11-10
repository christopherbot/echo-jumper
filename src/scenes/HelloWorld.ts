import BaseScene from './BaseScene'

class HelloWorld extends BaseScene {
  constructor() {
    super('helloworld')
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
  }

  update() {}
}

export default HelloWorld
