import BaseScene from './BaseScene'

class Title extends BaseScene {
  constructor() {
    super('title')
  }

  preload() {
    this.load.image('box', 'images/box.png')
    this.load.image('stretched-box', 'images/stretched-box.png')
    this.load.spritesheet('star', 'images/star.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.audio('background', `audio/background.mp3`)
  }

  create() {
    const backgroundMusic = this.sound.add('background', {
      volume: 1,
      loop: true,
    })
    backgroundMusic.play()

    this.add
      .text(
        this.middleX,
        this.middleY - 100,
        this.gameTitle,
        this.gameTitleStyle,
      )
      .setOrigin(0.5, 0.5)
      .setPadding(5)

    const enterCopy = 'Press [Enter] to continue'
    const enterText = this.add
      .text(this.gameWidth - 15, 15, enterCopy)
      .setOrigin(1, 0)

    let enterTextHasBrackets = true

    this.time.addEvent({
      delay: 1000,
      repeat: -1,
      callback: () => {
        if (enterTextHasBrackets) {
          enterText.setText(enterCopy.replace('[', ' ').replace(']', ' '))
        } else {
          enterText.setText(enterCopy)
        }
        enterTextHasBrackets = !enterTextHasBrackets
      },
    })

    const enterKey = this.input.keyboard?.addKey('Enter')
    enterKey?.on('down', () => {
      this.scene.start('instructions')
    })
  }

  update() {}
}

export default Title
