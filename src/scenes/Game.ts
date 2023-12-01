import { Replayer } from '@src/classes'
import { Character, Player } from '@src/entities'
import type { Ability } from '@src/entities/Ability'

import BaseScene from './BaseScene'

type CharacterReplayer = Replayer<Character>

class Game extends BaseScene {
  private player!: Player
  private currentAbilities: Ability[] = [
    'triple jump',
    'horizontal stretch',
    'top bumper',
  ]
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
    // To prevent jitters when the player is on top of a replay
    // see: https://github.com/photonstorm/phaser/pull/4989
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

    this.player = new Player(this, 50, 500, this.currentAbilities, {
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
      r: {
        down: () => {
          const lastReplayer = this.replayers.pop()
          lastReplayer?.teardown()
          const replays = this.replays.getChildren()

          const lastReplay = replays.at(-1)
          if (lastReplay) {
            this.replays.remove(lastReplay, true, true)
          }
        },
        up: () => {},
        pressed: () => {},
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
     */

    // NOTE:
    // In the collision callbacks below, the immovable property of each
    // replay is being toggled depending on the interaction:
    //
    // - A replay should be immovable when colliding with the player to prevent
    //   the player from being able to push it around, and instead allow the
    //   replay to push the player around
    // - A replay should be movable when colliding with another replay that was
    //   created before it. However, replays that are horizontally stretched
    //   should always be immovable.
    //
    // See:
    // https://www.html5gamedevs.com/topic/28876-collision-make-sprites-immovable-and-impassable/#comment-166156

    // allow player to collide with replays
    this.physics.add.collider(this.player, this.replays, (_player, _replay) => {
      const player = _player as Player
      const replay = _replay as Character
      replay.setImmovable(true)

      if (replay.shouldBumpSpriteOnTop(player)) {
        player.onBumpY()
      }
    })

    // allow replays to collide with themselves
    this.physics.add.collider(
      this.replays,
      this.replays,
      (_replay1, _replay2) => {
        const replays = this.replays.getChildren()
        const replay1 = _replay1 as Character
        const replay2 = _replay2 as Character

        const replay1Index = replays.findIndex((child) => child === replay1)
        const replay2Index = replays.findIndex((child) => child === replay2)

        const canReplay1BeMoved = replay1Index > replay2Index

        if (canReplay1BeMoved) {
          if (!replay1.isHorizontallyStretched) {
            replay1.setImmovable(false)
            if (replay2.shouldBumpSpriteOnTop(replay1)) {
              replay1.onBumpY()
            }
          }
        } else {
          if (!replay2.isHorizontallyStretched) {
            replay2.setImmovable(false)
          }
        }
      },
    )

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

    // In case a direction key was being held, ensure the character
    // stops at the end of a recording
    currentReplayer.addCommand('stopMovingX')

    currentReplayer.stopRecording()

    const replay = new Character(
      this,
      this.replayStartPosition.x,
      this.replayStartPosition.y,
      this.currentAbilities,
    )

    // THOUGHT: add more gravity for each replay index so later replays
    // fall faster?
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
    for (const _replay of this.replays.getChildren()) {
      const replay = _replay as Character
      replay.setImmovable(true)
    }
  }

  teardown() {
    this.replayers.forEach((replayer) => {
      replayer.teardown()
    })
    this.replayers = []
    this.replays.getChildren().forEach((_replay) => {
      const replay = _replay as Character
      replay.stopMoving()
    })
    this.replays.clear(true, true)
  }
}

export default Game
