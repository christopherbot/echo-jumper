import { Controls, Replay } from '@src/components'

import Actor from './Actor'

class Player extends Actor {
  private readonly velocityX = 250
  private readonly velocityY = 470

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number,
  ) {
    super(scene, x, y, texture, frame)

    const controls = new Controls(scene, {
      onUp: () => {
        this._body.setVelocityY(-this.velocityY)
      },
      onDown: () => {
        this._body.setVelocityY(100)
      },
      onLeft: () => {
        this._body.setVelocityX(-this.velocityX)
      },
      onRight: () => {
        this._body.setVelocityX(this.velocityX)
      },
      onNeutral: () => {
        this._body.setVelocityX(0)
      },
    })

    const replay = new Replay(scene)

    this.addComponent(controls)
    this.addComponent(replay)
  }

  update() {
    super.update()
  }
}

export default Player
