import { Replayer } from '@src/classes'
import { Character, Player } from '@src/entities'
import type { Ability } from '@src/entities/Ability'

import BaseScene from './BaseScene'

type CharacterReplayer = Replayer<Character>

class Game extends BaseScene {
  private player!: Player
  private currentAbilities: Ability[] = ['triple jump', 'horizontal stretch']
  private replayers: CharacterReplayer[] = []
  private currentReplayer: CharacterReplayer | null = null
  private replays!: Phaser.Physics.Arcade.Group
  private replayStartPosition: { x: number; y: number } = { x: 0, y: 0 }

  private playerReplayCollider!: Phaser.Physics.Arcade.Collider
  private replayReplayCollider!: Phaser.Physics.Arcade.Collider

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

    // The default mass is already 1, this is here for consistency
    // with setting the replay mass
    // this.player.setMass(0.1)
    // this.player.setFriction(0)

    this.replays = this.physics.add.group({
      allowGravity: true,
      immovable: true,
      // immovable: false,
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

    // NOTE:
    // In the collision callbacks below, the immovable property of each
    // replay is being toggled depending on the interaction:
    //
    // - The replay should be immovable when colliding with the player to
    //   prevent the player from being able to push it around, and instead
    //   allow the replay to push the player around
    // - The replay should be movable when colliding with another replay to
    //   allow regular physics interactions between them. However, replays
    //   that are horizontally stretched should remain immovable.
    //
    // See:
    // https://www.html5gamedevs.com/topic/28876-collision-make-sprites-immovable-and-impassable/#comment-166156

    // allow player to collide with replays
    this.playerReplayCollider = this.physics.add.collider(
      this.player,
      this.replays,
      (_player, _replay) => {
        // const replay = _replay as Character
        // console.log('~~~ p mass', _player._body.mass)
        // console.log('~~~ r mass', _replay._body.mass)
        // replay.setImmovable(true)
      },
    )

    // allow replays to collide with themselves
    this.replayReplayCollider = this.physics.add.collider(
      this.replays,
      this.replays,
      (_replay1, _replay2) => {
        const replay1 = _replay1 as Character
        const replay2 = _replay2 as Character

        const i1 = this.replays
          .getChildren()
          .findIndex((child) => child === replay1)
        const i2 = this.replays
          .getChildren()
          .findIndex((child) => child === replay2)

        // console.log('~~~ replay1._body.mass', replay1._body.mass)
        // console.log('~~~ replay2._body.mass', replay2._body.mass)
        // console.log('~~~ i1 =', i1, '; i2 =', i2)

        if (i1 > i2 && !replay1.isHorizontallyStretched) {
          // console.log('~~~ 2 can move 1')
          replay1.setImmovable(false)
        }
        if (i2 > i1 && !replay2.isHorizontallyStretched) {
          // console.log('~~~ 1 can move 2')
          replay2.setImmovable(false)
        }
        // if (replay1._body.mass > replay2._body.mass) {
        //   console.log('~~~ replay2 -> 0')
        //   replay2.setImmovable(false)
        //   // replay2.setVelocity(0)
        // } else if (replay2._body.mass > replay1._body.mass) {
        //   replay1.setImmovable(false)
        //   console.log('~~~ replay1 -> 0')
        //   // replay1.setVelocity(0)
        // }

        if (!replay1.isHorizontallyStretched) {
          // console.log('~~~ 2 can move 1')
          // replay1.setImmovable(false)
        }
        if (!replay2.isHorizontallyStretched) {
          // console.log('~~~ 1 can move 2')
          // replay2.setImmovable(false)
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

    // replay.setMass(Math.pow(10, this.replays.getLength()))

    this.replays.add(replay)
    // const replayCount = this.replays.getLength()
    // this.replays.getChildren().forEach((_replay, index) => {
    //   const replay = _replay as Character
    //   const mass = Math.pow(1000, replayCount - index)
    //   replay.setMass(mass)
    //   console.log('~~~ replay._body.mass', replay._body.mass)
    // })

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
    // this.playerReplayCollider.destroy()
    // this.replayReplayCollider.destroy()
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
