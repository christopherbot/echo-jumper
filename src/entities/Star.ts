import Actor from './Actor'

class Star extends Actor {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'star')

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('star', {
        start: 0,
        end: 12,
      }),
      frameRate: 4,
      repeat: -1,
    })

    this._body.setAllowGravity(false)
    this.setImmovable(true)

    this.play('idle')
  }
}

export default Star
