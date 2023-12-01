import { Controls, type ControlsOptions } from '@src/components'

import type { Ability } from './Ability'
import Character from './Character'

class Player extends Character {
  private hasDoubleJumped = false
  private hasTripleJumped = false
  jumpText: Phaser.GameObjects.Text | null = null

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    abilities: Ability[],
    controlsOptions?: ControlsOptions,
  ) {
    super(scene, x, y, abilities)

    this.jumpText = scene.add.text(0, 0, this.jumpExtra).setOrigin(0.5)

    const controls = new Controls(scene, {
      up: {
        down: () => {
          if (this.isTouchingDown || this.canDoubleJump || this.canTripleJump) {
            if (!this.isTouchingDown) {
              if (this.hasDoubleJumped) {
                this.hasTripleJumped = true
              } else {
                this.hasDoubleJumped = true
              }
            }

            this.jump()
            controlsOptions?.up.down()
          }
        },
        up: () => {
          controlsOptions?.up.up()
        },
        pressed: () => {
          controlsOptions?.up.pressed()
        },
      },
      down: {
        down: () => {
          this.onDown()
          controlsOptions?.down.down()
        },
        up: () => {
          controlsOptions?.down.up()
        },
        pressed: () => {
          controlsOptions?.down.pressed()
        },
      },
      left: {
        down: () => {
          controlsOptions?.left.down()
        },
        up: () => {
          controlsOptions?.left.up()
        },
        pressed: () => {
          this.moveLeft()
          controlsOptions?.left.pressed()
        },
      },
      right: {
        down: () => {
          controlsOptions?.right.down()
        },
        up: () => {
          controlsOptions?.right.up()
        },
        pressed: () => {
          this.moveRight()
          controlsOptions?.right.pressed()
        },
      },
      r: {
        down: () => {
          controlsOptions?.r.down()
        },
        up: () => {},
        pressed: () => {},
      },
      onHorizontalNeutral: () => {
        this.stopMovingX()
        controlsOptions?.onHorizontalNeutral()
      },
    })

    this.addComponent(controls)
  }

  get jumpExtra() {
    switch (this.ability) {
      case 'double jump':
        return this.hasDoubleJumped ? '0' : '1'
      case 'triple jump':
        return this.hasTripleJumped ? '0' : this.hasDoubleJumped ? '1' : '2'
      default:
        return ''
    }
  }

  private get isTouchingDown() {
    return this._body.onFloor() || this._body.touching.down
  }

  private get canDoubleJump() {
    return (
      (this.abilities.includes('double jump') ||
        this.abilities.includes('triple jump')) &&
      !this.hasDoubleJumped
    )
  }

  private get canTripleJump() {
    return this.abilities.includes('triple jump') && !this.hasTripleJumped
  }

  resetHorizontalStretch() {
    this.resetScale()
    this.resetStretchProperties()
  }

  update() {
    super.update()

    this.jumpText?.setPosition(this.x, this.y)
    this.jumpText?.setText(this.jumpExtra)

    if (this.hasDoubleJumped && this.isTouchingDown) {
      this.hasDoubleJumped = false
    }

    if (this.hasTripleJumped && this.isTouchingDown) {
      this.hasTripleJumped = false
    }
  }
}

export default Player
