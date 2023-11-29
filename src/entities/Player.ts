import { Controls, type ControlsOptions } from '@src/components'

import type { Ability } from './Ability'
import Character from './Character'

class Player extends Character {
  private hasDoubleJumped = false

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    abilities: Ability[],
    controlsOptions: ControlsOptions,
  ) {
    super(scene, x, y, abilities)

    const controls = new Controls(scene, {
      up: {
        down: () => {
          if (this.isTouchingDown || this.canDoubleJump) {
            if (!this.isTouchingDown) {
              this.hasDoubleJumped = true
            }

            this.jump()
            controlsOptions.up.down()
          }
        },
        up: () => {
          controlsOptions.up.up()
        },
        pressed: () => {
          controlsOptions.up.pressed()
        },
      },
      down: {
        down: () => {
          this.onDown()
          controlsOptions.down.down()
        },
        up: () => {
          controlsOptions.down.up()
        },
        pressed: () => {
          controlsOptions.down.pressed()
        },
      },
      left: {
        down: () => {
          controlsOptions.left.down()
        },
        up: () => {
          controlsOptions.left.up()
        },
        pressed: () => {
          this.moveLeft()
          controlsOptions.left.pressed()
        },
      },
      right: {
        down: () => {
          controlsOptions.right.down()
        },
        up: () => {
          controlsOptions.right.up()
        },
        pressed: () => {
          this.moveRight()
          controlsOptions.right.pressed()
        },
      },
      onHorizontalNeutral: () => {
        this.stopMovingX()
        controlsOptions.onHorizontalNeutral()
      },
    })

    this.addComponent(controls)
  }

  private get isTouchingDown() {
    return this._body.onFloor() || this._body.touching.down
  }

  private get canDoubleJump() {
    return this.abilities.includes('double jump') && !this.hasDoubleJumped
  }

  resetHorizontalStretch() {
    this.resetScale()
    this.resetStretchProperties()
  }

  update() {
    super.update()

    if (this.hasDoubleJumped && this.isTouchingDown) {
      this.hasDoubleJumped = false
    }
  }
}

export default Player
