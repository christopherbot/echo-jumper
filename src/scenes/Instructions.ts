import { Player, Character } from '@src/entities'
import type { Ability } from '@src/entities/Ability'

import BaseScene from './BaseScene'

interface AbilityInstructions {
  ability: Ability
  name: string
  upText: string
  upExtraText: string
  downText: string
  extraText: string
  x: number
}

class Instructions extends BaseScene {
  player: Player | null = null
  dummy!: Character
  dummyText: Phaser.GameObjects.Text | null = null
  collider: Phaser.Physics.Arcade.Collider | null = null

  nameHighlightText: Phaser.GameObjects.Text | null = null
  upText: Phaser.GameObjects.Text | null = null
  upExtraText: Phaser.GameObjects.Text | null = null
  downText: Phaser.GameObjects.Text | null = null
  extraText: Phaser.GameObjects.Text | null = null
  spaceText: Phaser.GameObjects.Text | null = null

  constructor() {
    super('instructions')
  }

  preload() {}

  private createDummyCharacter(x: number, y: number) {
    this.dummy = new Character(this, x, y, ['double jump'])
    this.dummy.setFriction(0)
    this.dummyText = this.add
      .text(x, y, 'Dummy', { color: '#F97587' })
      .setOrigin(0.5, 1)
      .setRotation(0.35)

    this.time.addEvent({
      delay: 2000,
      repeat: -1,
      callback: () => {
        this.dummy.jump()
        const bounds = this.dummy.x < this.middleX ? [-50, 200] : [-200, 50]
        const randomVelocityX = Phaser.Math.Between(bounds[0], bounds[1])
        this.dummy.setVelocityX(randomVelocityX)
        this.time.addEvent({
          delay: 930,
          callback: () => {
            this.dummy.setVelocityX(0)
          },
        })
      },
    })
  }

  private createNewPlayer(x: number, y: number, ability: Ability) {
    if (this.player) {
      this.player.teardown()
      this.player.destroy(true)
      this.collider?.destroy()
    }
    this.player = new Player(this, x, y, [ability])
    this.collider = this.physics.add.collider(
      this.player,
      this.dummy,
      (_player, _dummy) => {
        const player = _player as Player
        const dummy = _dummy as Character

        if (player.isHorizontallyStretched) {
          player.setImmovable(true)
        }

        if (
          !player.isHorizontallyStretched &&
          player.shouldBumpSpriteOnTop(dummy)
        ) {
          dummy.onBumpY()
        }
      },
    )
  }

  private createClickableCharacterType(instructions: AbilityInstructions) {
    const { ability, name, upText, upExtraText, downText, extraText, x } =
      instructions
    const startY = 300
    const addText = () =>
      this.add.text(x, startY + 50, name).setOrigin(0.5, 0.5)

    const character = new Character(this, x, startY, [ability])
    character._body.setAllowGravity(false)

    character.setInteractive({ useHandCursor: true }).on('pointerdown', () => {
      onPointerDown()
    })

    addText()
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        onPointerDown()
      })

    const onPointerDown = () => {
      this.createNewPlayer(x, 250, ability)
      this.nameHighlightText?.destroy()
      this.nameHighlightText = addText().setColor('#0095e2')

      const textY = startY + 100
      if (!this.upText) {
        this.upText = this.add
          .text(this.middleX, textY - 7, upText)
          .setOrigin(0.5, 0.5)
        this.add.text(this.middleX, textY + 20, '↑').setOrigin(0.5, 0.5)
      }
      this.upText?.setText(upText)

      if (!this.upExtraText) {
        this.upExtraText = this.add
          .text(this.middleX + 32, textY - 20, upExtraText, {
            fontSize: 12,
            color: '#11AD0B',
          })
          .setOrigin(0.5, 0.5)
          .setRotation(0.35)

        this.tweens.add({
          targets: this.upExtraText,
          alpha: 0.6,
          yoyo: true,
          repeat: -1,
          duration: 1000,
          ease: 'Cubic.easeIn',
        })
      }
      this.upExtraText?.setText(upExtraText)

      this.add.text(this.middleX - 30, textY + 50, '←').setOrigin(0.5, 0.5)
      this.add.text(this.middleX - 60, textY + 50, 'Move').setOrigin(1, 0.5)

      this.add.text(this.middleX + 30, textY + 50, '→').setOrigin(0.5, 0.5)
      this.add.text(this.middleX + 60, textY + 50, 'Move').setOrigin(0, 0.5)

      if (!this.downText) {
        this.add.text(this.middleX, textY + 80, '↓').setOrigin(0.5, 0.5)
        this.downText = this.add
          .text(this.middleX, textY + 110, downText)
          .setOrigin(0.5, 0.5)
      }
      this.downText?.setText(downText)

      if (!this.extraText) {
        this.extraText = this.add
          .text(0, 0, extraText, { fontSize: 12, color: '#E4E300' })
          .setOrigin(0.5, 0.5)
          .setRotation(0.35)
      }
      this.extraText?.setText(extraText)

      if (!this.spaceText) {
        this.spaceText = this.add
          .text(this.middleX + 240, textY + 80, '[Space]')
          .setOrigin(0.5)
        this.add
          .text(this.middleX + 240, textY + 110, 'Start/stop recording')
          .setOrigin(0.5)
        this.add
          .text(this.middleX + 270, textY + 40, 'Only available\n  in game', {
            fontSize: 13,
            color: '#E68F3C',
          })
          .setRotation(0.35)
      }
    }
  }

  create() {
    // this.drawGrid({
    //   x: 0,
    //   y: 0,
    //   width: this.gameWidth,
    //   height: this.gameHeight,
    // })

    this.add.text(15, 15, this.gameTitle).setOrigin(0, 0)

    const enterCopy = 'Press [Enter] to play'
    const enterText = this.add
      .text(this.gameWidth - 15, 15, enterCopy)
      .setOrigin(1, 0)
    let enterTextHasBrackets = true

    this.time.addEvent({
      delay: 1000,
      repeat: -1,
      callback: () => {
        if (enterTextHasBrackets) {
          enterText.setText(enterCopy.replace('[', ' ').replace(']', ' '))
        } else {
          enterText.setText(enterCopy)
        }
        enterTextHasBrackets = !enterTextHasBrackets
      },
    })

    const textY = 50

    this.add.text(this.middleX, textY, 'Instructions').setOrigin(0.5, 0.5)

    const instructions = [
      "It's simple - reach the goal.",
      "You're given control of one box at a time.",
      '',
      'Record your movements,',
      'play them back,',
      'and move on to a new box.',
      '',
      'Try out the possible abilities by clicking on the boxes below.',
      "They'll be randomized during the game.",
    ]

    instructions.forEach((instruction, index) => {
      this.add
        .text(this.middleX, textY + 40 + 20 * index, instruction, {
          fontSize: 15,
        })
        .setOrigin(0.5, 0.5)
    })

    const abilityInstructions: AbilityInstructions[] = [
      {
        ability: 'double jump',
        name: 'Double Jump',
        upText: 'Jump',
        upExtraText: 'Up to 2\ntimes!',
        downText: 'n/a',
        extraText: '',
        x: 100,
      },
      {
        ability: 'triple jump',
        name: 'Triple Jump',
        upText: 'Jump',
        upExtraText: 'Up to 3\ntimes!',
        downText: 'n/a',
        extraText: '',
        x: 300,
      },
      {
        ability: 'top bumper',
        name: 'Top Bumper',
        upText: 'Jump',
        upExtraText: '',
        downText: 'n/a',
        extraText: 'Bump away anything\nthat lands on top!',
        x: 500,
      },
      {
        ability: 'horizontal stretch',
        name: 'Platform',
        upText: 'Jump',
        upExtraText: '',
        downText: 'Toggle stretch',
        extraText: 'Perfect for..\nplatforming?',
        x: 700,
      },
    ]

    abilityInstructions.forEach((abilityInstruction) => {
      this.createClickableCharacterType(abilityInstruction)
    })

    this.createDummyCharacter(600, 500)

    const enterKey = this.input.keyboard?.addKey('Enter')
    enterKey?.on('down', () => {
      this.scene.start('game')
    })
  }

  update() {
    this.dummyText?.setPosition(this.dummy.x + 15, this.dummy.y - 18)
    if (this.player) {
      this.player.update()
      this.extraText?.setPosition(this.player.x + 30, this.player.y - 45)
    }
  }
}

export default Instructions
