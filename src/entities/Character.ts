import { assertNever } from '@src/utils'

import Actor from './Actor'

type Ability =
  | 'double jump'
  | 'pogo'
  | 'top bumper'
  | 'left right bumpers'
  | 'horizontal stretch'
  | 'anti gravity'

class Character extends Actor {
  private startPosition = { x: 0, y: 0 }
  private readonly velocityX = 250
  private readonly velocityY = 470

  constructor(scene: Phaser.Scene, x: number, y: number, ability: Ability) {
    const texture = (() => {
      // TODO
      switch (ability) {
        case 'double jump':
        case 'pogo':
        case 'top bumper':
        case 'left right bumpers':
        case 'horizontal stretch':
        case 'anti gravity':
          return ''
        default:
          assertNever(ability, `Unhandled ability: ${ability}`)
      }
    })()

    super(scene, x, y, texture)

    this.startPosition = { x, y }

    // TODO create anims for:
    // idle, run, jump, hit
    // this.anims.create({})

    this.play('idle')
  }

  noop() {}

  jump() {
    this._body.setVelocityY(-this.velocityY)
  }

  fall() {
    this._body.setVelocityY(750)
  }

  moveLeft() {
    this._body.setVelocityX(-this.velocityX)
  }

  moveRight() {
    this._body.setVelocityX(this.velocityX)
  }

  stopMoving() {
    this._body.setVelocity(0)
  }

  stopMovingX() {
    this._body.setVelocityX(0)
  }

  resetPosition() {
    this._body.reset(this.startPosition.x, this.startPosition.y)
  }

  teardown() {
    // this.resetPosition()
    // this.destroy()
  }
}

export default Character
