import { removeNil } from '@src/utils'

import type Component from './Component'

interface Options {
  onUp: () => void
  onDown: () => void
  onLeft: () => void
  onRight: () => void
  onNeutral: () => void
}

class Controls implements Component {
  name = 'controls'

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null
  private keyW: Phaser.Input.Keyboard.Key | null = null
  private keyA: Phaser.Input.Keyboard.Key | null = null
  private keyS: Phaser.Input.Keyboard.Key | null = null
  private keyD: Phaser.Input.Keyboard.Key | null = null

  options: Options

  constructor(scene: Phaser.Scene, options: Options) {
    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys()
      this.keyW = scene.input.keyboard.addKey('W')
      this.keyA = scene.input.keyboard.addKey('A')
      this.keyS = scene.input.keyboard.addKey('S')
      this.keyD = scene.input.keyboard.addKey('D')
    }

    this.options = options
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

  private isSomeKeyJustDown = (keys: Phaser.Input.Keyboard.Key[]) => {
    return keys.some((key) => Phaser.Input.Keyboard.JustDown(key))
  }

  update() {
    if (this.isSomeKeyJustDown(this.upKeys)) {
      this.options.onUp()
    }

    if (this.isSomeKeyDown(this.downKeys)) {
      this.options.onDown()
    }

    if (
      !this.isSomeKeyDown(this.leftKeys) &&
      !this.isSomeKeyDown(this.rightKeys)
    ) {
      this.options.onNeutral()
    }

    if (this.isSomeKeyDown(this.leftKeys)) {
      this.options.onLeft()
    }

    if (this.isSomeKeyDown(this.rightKeys)) {
      this.options.onRight()
    }
  }
}

export default Controls
