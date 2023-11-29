import { removeNil } from '@src/utils'

import type Component from './Component'

interface KeyOptions {
  /**
   * Fires once when the key is pressed down
   */
  down: () => void
  /**
   * Fires once when the key is released
   */
  up: () => void
  /**
   * Fires continuously when the key is held down
   */
  pressed: () => void
}

export interface ControlsOptions {
  up: KeyOptions
  down: KeyOptions
  left: KeyOptions
  right: KeyOptions
  onHorizontalNeutral: () => void
}

class Controls implements Component {
  name = 'controls'

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null
  private keyW: Phaser.Input.Keyboard.Key | null = null
  private keyA: Phaser.Input.Keyboard.Key | null = null
  private keyS: Phaser.Input.Keyboard.Key | null = null
  private keyD: Phaser.Input.Keyboard.Key | null = null

  options: ControlsOptions

  constructor(scene: Phaser.Scene, options: ControlsOptions) {
    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys()
      this.keyW = scene.input.keyboard.addKey('W')
      this.keyA = scene.input.keyboard.addKey('A')
      this.keyS = scene.input.keyboard.addKey('S')
      this.keyD = scene.input.keyboard.addKey('D')
    }

    this.options = options

    this.setupKeyListeners()
  }

  private get upKeys() {
    return removeNil([this.cursors?.up, this.keyW])
  }

  private get downKeys() {
    return removeNil([this.cursors?.down, this.keyS])
  }

  private get leftKeys() {
    return removeNil([this.cursors?.left, this.keyA])
  }

  private get rightKeys() {
    return removeNil([this.cursors?.right, this.keyD])
  }

  private isSomeKeyDown = (keys: Phaser.Input.Keyboard.Key[]) => {
    return keys.some((key) => key.isDown)
  }

  // private isSomeKeyJustDown = (keys: Phaser.Input.Keyboard.Key[]) => {
  //   return keys.some((key) => Phaser.Input.Keyboard.JustDown(key))
  // }

  private setupKeyListeners() {
    this.upKeys.forEach((upKey) => {
      upKey
        .on('down', () => {
          this.options.up.down()
        })
        .on('up', () => {
          this.options.up.up()
        })
    })

    this.downKeys.forEach((downKey) => {
      downKey
        .on('down', () => {
          this.options.down.down()
        })
        .on('up', () => {
          this.options.down.up()
        })
    })

    this.leftKeys.forEach((leftKey) => {
      leftKey
        .on('down', () => {
          this.options.left.down()
        })
        .on('up', () => {
          this.options.left.up()
        })
    })

    this.rightKeys.forEach((rightKey) => {
      rightKey
        .on('down', () => {
          this.options.right.down()
        })
        .on('up', () => {
          this.options.right.up()
        })
    })
  }

  update() {
    // if (this.isSomeKeyJustDown(this.upKeys)) {
    //   this.options.up.down()
    // }

    // if (this.isSomeKeyDown(this.downKeys)) {
    //   this.options.down.pressed()
    // }

    const isLeftPressed = this.isSomeKeyDown(this.leftKeys)
    const isRightPressed = this.isSomeKeyDown(this.rightKeys)
    const areLeftAndRightBothPressed = isLeftPressed && isRightPressed
    const areLeftAndRightBothUnpressed = !isLeftPressed && !isRightPressed

    if (areLeftAndRightBothPressed || areLeftAndRightBothUnpressed) {
      this.options.onHorizontalNeutral()
    } else {
      if (isLeftPressed) {
        this.options.left.pressed()
      }

      if (isRightPressed) {
        this.options.right.pressed()
      }
    }
  }
}

export default Controls
