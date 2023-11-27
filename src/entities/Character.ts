import Actor from './Actor'

class Character extends Actor {
  private readonly velocityX = 250
  private readonly velocityY = 470
  private readonly accelerationX = 2000
  private readonly accelerationY = 470

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame)

    // TODO create anims for:
    // idle, run, jump, hit
    // this.anims.create({})

    this.play('idle')
  }

  noop() {}

  // double jump
  jump() {
    this._body.setVelocityY(-this.velocityY)
  }

  // stretch (horiz, vert)
  // pogo jump
  fall() {
    this._body.setVelocityY(750)
    // this._body.setAccelerationY(4000)
  }

  moveLeft() {
    // this._body.setAccelerationX(-this.accelerationX)
    this._body.setVelocityX(-this.velocityX)
  }

  moveRight() {
    // this._body.setAccelerationX(this.accelerationX)
    this._body.setVelocityX(this.velocityX)
  }

  stopMovingX() {
    this._body.setVelocityX(0) //.setAccelerationX(0)
  }
}

export default Character
