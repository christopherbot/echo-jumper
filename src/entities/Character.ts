// import { assertNever } from '@src/utils'

import type { Ability } from './Ability'
import Actor from './Actor'

class Character extends Actor {
  private startPosition = { x: 0, y: 0 }
  private isHorizontallyStretched = false
  private horizontalStretchTween: Phaser.Tweens.Tween | null = null

  protected abilities: Ability[]
  // TRY: high gravity and high velocity for less floaty controls
  // THOUGHT: prevent moving in x direction when jumping?
  private readonly velocityX = 250
  private readonly velocityY = 470

  constructor(scene: Phaser.Scene, x: number, y: number, abilities: Ability[]) {
    const texture = (() => {
      // TODO
      // switch (ability) {
      //   case 'double jump':
      //   case 'triple jump':
      //   case 'pogo':
      //   case 'top bumper':
      //   case 'left right bumpers':
      //   case 'horizontal stretch':
      //   case 'anti gravity':
      //     return ''
      //   default:
      //     assertNever(ability, `Unhandled ability: ${ability}`)
      // }
      return ''
    })()

    super(scene, x, y, texture)

    this.abilities = abilities

    this.startPosition = { x, y }

    // TODO create anims for:
    // idle, run, jump, hit
    // this.anims.create({})

    this.play('idle')
  }

  noop() {}

  jump() {
    if (this.isHorizontallyStretched) {
      this.undoStretchHorizontally()
    }
    this._body.setVelocityY(-this.velocityY)
  }

  onDown() {
    if (this.abilities.includes('horizontal stretch')) {
      this.horizontalStretchTween?.stop()
      if (this.isHorizontallyStretched) {
        this.undoStretchHorizontally()
      } else {
        this.stretchHorizontally()
      }
    }
  }

  moveLeft() {
    if (this.isHorizontallyStretched) {
      return
    }
    this._body.setVelocityX(-this.velocityX)
  }

  moveRight() {
    if (this.isHorizontallyStretched) {
      return
    }
    this._body.setVelocityX(this.velocityX)
  }

  stopMoving() {
    this._body.setVelocity(0)
  }

  stopMovingX() {
    this._body.setVelocityX(0)
  }

  resetScale() {
    this.horizontalStretchTween?.stop()
    this.horizontalStretchTween = null
    this.setScale(1)
  }

  resetPosition() {
    this._body.reset(this.startPosition.x, this.startPosition.y)
  }

  stretchHorizontally() {
    this.isHorizontallyStretched = true
    this._body.setAllowGravity(false)
    // this.setImmovable(true)
    this.stopMoving()

    this.horizontalStretchTween = this.scene.tweens.add({
      targets: this,
      scaleX: 10,
      scaleY: 0.65,
      duration: 150,
      ease: 'Cubic.easeIn',
    })
  }

  undoStretchHorizontally() {
    this.resetStretchProperties()

    this.horizontalStretchTween = this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      duration: 150,
      ease: 'Cubic.easeIn',
    })
  }

  resetStretchProperties() {
    this.isHorizontallyStretched = false
    this._body.setAllowGravity(true)
    // this.setImmovable(false)
  }

  reset() {
    // TODO: before reseting, leave a fading out replica?
    this.resetScale()
    this.resetPosition()
    this.resetStretchProperties()
  }

  teardown() {
    // this.resetPosition()
    // this.destroy()
  }
}

export default Character
