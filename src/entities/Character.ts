import type { Ability } from './Ability'
import Actor from './Actor'

class Character extends Actor {
  private startPosition = { x: 0, y: 0 }
  isHorizontallyStretched = false
  private horizontalStretchTween: Phaser.Tweens.Tween | null = null

  protected abilities: Ability[]
  // TRY: high gravity and high velocity for less floaty controls
  // THOUGHT: prevent moving in x direction when jumping? or use friction on replay?
  private readonly velocityX = 250
  private readonly velocityY = 470
  extraText: Phaser.GameObjects.Text | null = null

  constructor(scene: Phaser.Scene, x: number, y: number, abilities: Ability[]) {
    super(scene, x, y, 'box')

    this.abilities = abilities
    this._setTint()
    this.extraText = this.scene.add.text(0, 0, this.extra).setOrigin(0.5)
    this.startPosition = { x, y }

    // TODO create anims for:
    // idle, run, jump, hit
    // this.anims.create({})

    // this.play('idle')
  }

  get ability() {
    return this.abilities[0]
  }

  setAbilities(abilities: Ability[]) {
    this.abilities = abilities
    this._setTint()
    try {
      this.setTexture('box')
    } catch {
      // noop; sometimes this fails
    }
    this.setExtraText()
  }

  _setTint() {
    switch (this.ability) {
      case 'double jump':
        this.setTint(0x00ff00)
        break
      case 'triple jump':
        this.setTint(0xffff00)
        break
      case 'top bumper':
        this.setTint(0x0000ff)
        break
      case 'horizontal stretch':
        this.setTint(0xff0000)
        break
    }
  }

  setExtraText() {
    this.extraText?.setText(this.extra)
  }

  get extraXY() {
    switch (this.ability) {
      case 'top bumper':
        return { x: this.x, y: this.y - 10 }
      case 'horizontal stretch':
        return { x: this.x, y: this.y + 10 }
      default:
        return { x: this.x, y: this.y }
    }
  }

  get extra() {
    switch (this.ability) {
      case 'top bumper':
        return '↥'
      case 'horizontal stretch':
        return '↔'
      default:
        return ''
    }
  }

  get hasTopBumper() {
    return this.abilities.includes('top bumper')
  }

  shouldBumpSpriteOnTop(sprite: Phaser.Physics.Arcade.Sprite) {
    if (!this.hasTopBumper) {
      return false
    }

    // sometimes the sprite bottom is a little off (< 1px) from overlapping
    // the character top, so accommodate with a small buffer
    const jitterAmount = 2

    // keep in mind the origins are (0.5, 0,5)
    const isSpriteOverlappingTop =
      sprite.y + sprite.displayHeight >= this.y - jitterAmount &&
      sprite.y < this.y + this.displayHeight

    const isSpriteWithinLeftAndRight =
      sprite.x + sprite.displayWidth / 2 > this.x - this.displayWidth / 2 &&
      sprite.x < this.x + this.displayWidth / 2

    return isSpriteOverlappingTop && isSpriteWithinLeftAndRight
  }

  noop() {}

  jump() {
    if (this.isHorizontallyStretched) {
      this.undoStretchHorizontally()
    }
    this._body?.setVelocityY(-this.velocityY)
  }

  onBumpY() {
    this._body?.setVelocityY(1.5 * -this.velocityY)
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
    this._body?.setVelocityX(-this.velocityX)
  }

  moveRight() {
    if (this.isHorizontallyStretched) {
      return
    }
    this._body?.setVelocityX(this.velocityX)
  }

  stopMoving() {
    this._body?.setVelocity(0)
  }

  stopMovingX() {
    this._body?.setVelocityX(0)
  }

  resetScale() {
    this.horizontalStretchTween?.stop()
    this.horizontalStretchTween = null
    this.setScale(1)
  }

  resetPosition() {
    this._body?.reset(this.startPosition.x, this.startPosition.y)
  }

  stretchHorizontally() {
    try {
      this.setTexture('stretched-box')
    } catch {
      // noop; sometimes this fails
    }
    this.isHorizontallyStretched = true
    this._body?.setAllowGravity(false)
    this.stopMoving()

    this.horizontalStretchTween = this.scene.tweens.add({
      targets: this,
      scaleX: 8,
      // TODO: I want to scale down the y slightly so it looks like
      // the matter is shifting rather than purely growing, but upon
      // a loop reset, the player phases through the replay.
      // scaleY: 0.65,
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
      onComplete: () => {
        try {
          this.setTexture('box')
        } catch {
          // noop; sometimes this fails
        }
      },
    })
  }

  resetStretchProperties() {
    this.isHorizontallyStretched = false
    this._body?.setAllowGravity(true)
  }

  reset() {
    // TODO: before reseting, leave a fading out replica?
    this.resetScale()
    this.resetPosition()
    this.resetStretchProperties()
  }

  update() {
    super.update()
    const { x, y } = this.extraXY

    this.extraText?.setPosition(x, y)
  }

  teardown() {
    super.teardown()
    this.extraText?.destroy()
  }
}

export default Character
