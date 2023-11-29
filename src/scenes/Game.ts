import { Replayer } from '@src/classes'
import { Character, Player } from '@src/entities'
import type { Ability } from '@src/entities/Ability'

import BaseScene from './BaseScene'

type CharacterReplayer = Replayer<Character>

class Game extends BaseScene {
  private player!: Player
  private currentAbility: Ability = 'horizontal stretch'
  private replayers: CharacterReplayer[] = []
  private currentReplayer: CharacterReplayer | null = null
  private replays!: Phaser.Physics.Arcade.Group
  private replayStartPosition: { x: number; y: number } = { x: 0, y: 0 }

  private recordingText: Phaser.GameObjects.Text | null = null

  constructor() {
    super('game')
  }

  preload() {}

  create() {
    this.physics.world.fixedStep = false

    this.drawGrid({
      x: 0,
      y: 0,
      width: this.gameWidth,
      height: this.gameHeight,
    })

    this.add
      .text(
        this.middleX,
        this.middleY - 100,
        this.gameTitle,
        this.gameTitleStyle,
      )
      .setOrigin(0.5, 0.5)
      .setPadding(5)

    this.player = new Player(this, 50, 500, this.currentAbility, {
      up: {
        down: () => {
          this.currentReplayer?.addCommand('jump')
        },
        up: () => {},
        pressed: () => {},
      },
      down: {
        down: () => {
          this.currentReplayer?.addCommand('onDown')
        },
        up: () => {},
        pressed: () => {},
      },
      left: {
        down: () => {},
        up: () => {},
        pressed: () => {
          this.currentReplayer?.addCommand('moveLeft')
        },
      },
      right: {
        down: () => {},
        up: () => {},
        pressed: () => {
          this.currentReplayer?.addCommand('moveRight')
        },
      },
      onHorizontalNeutral: () => {
        this.currentReplayer?.addCommand('stopMovingX')
      },
    })

    this.replays = this.physics.add.group({
      allowGravity: true,
      immovable: true,
      collideWorldBounds: true,
    })

    /**
     * Collision ideas:
     *
     * when touching a moving replay, move the player/replay in the same direction
     * so that it sticks to them and doesn't slide out from under
     *
     * add custom bounds when colliding?
     */

    // allow player to collide with replays
    this.physics.add.collider(this.player, this.replays)
    // allow replays to collide with themselves
    this.physics.add.collider(this.replays, this.replays)
    // this.physics.add.collider(this.replays, this.replays, (a, b) => {
    //   console.log('~~~ replays collider')
    //   console.log('~~~ a', a)
    //   console.log('~~~ b', b)
    // })

    const spaceKey = this.input.keyboard?.addKey('SPACE')
    spaceKey?.on('down', () => {
      if (!this.currentReplayer) {
        this.startRecording()
        this.recordingText = this.add.text(6, 20, 'Recording')
      } else {
        this.player.resetHorizontalStretch()
        this.endRecordingAndStartReplay()
        this.recordingText?.destroy()
      }
    })
  }

  private startRecording() {
    this.replayStartPosition = { x: this.player.x, y: this.player.y }

    const replayer = new Replayer<Character>(this)
    this.currentReplayer = replayer
    this.replayers.push(replayer)

    replayer.startRecording()

    // Add a noop command so there is at least one command in the list,
    // otherwise the tcrp plugin can fail during playback
    replayer.addCommand('noop')
  }

  private endRecordingAndStartReplay() {
    const currentReplayer = this.currentReplayer

    if (!currentReplayer) {
      return
    }

    // in case a direction key was being held, ensure the character
    // stops at the end of a recording
    currentReplayer.addCommand('stopMovingX')

    currentReplayer.stopRecording()

    const replay = new Character(
      this,
      this.replayStartPosition.x,
      this.replayStartPosition.y,
      this.currentAbility,
    )

    // replay.setPushable(true)
    // replay.setImmovable(true)

    this.replays.add(replay)

    currentReplayer.startReplay(replay, {
      onLoopComplete: () => {
        replay.reset()
      },
    })

    this.currentReplayer = null
  }

  update() {
    this.player.update()
  }

  teardown() {
    this.replayers.forEach((replayer) => {
      replayer.teardown()
    })
    this.replays.getChildren().forEach((_replay) => {
      const replay = _replay as Character
      replay.stopMoving()
    })
  }
}

export default Game
