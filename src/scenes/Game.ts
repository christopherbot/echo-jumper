// import type TCRPPlugin from 'phaser3-rex-plugins/plugins/arcadetcrp-plugin.js'
// import type TcrpPlayer from 'phaser3-rex-plugins/plugins/logic/runcommands/arcadetcrp/Player'
// import type TcrpRecorder from 'phaser3-rex-plugins/plugins/logic/runcommands/arcadetcrp/Recorder'
// import type StepRunner from 'phaser3-rex-plugins/plugins/logic/runcommands/arcadetcrp/StepRunner'

import { Replayer } from '@src/classes'
import { Character, Player } from '@src/entities'

import BaseScene from './BaseScene'

type CharacterReplay = Replayer<Character>

class Game extends BaseScene {
  private player!: Player
  // private replays: Character[] = []
  private replayers: CharacterReplay[] = []
  private currentReplayer: CharacterReplay | null = null
  private replays!: Phaser.Physics.Arcade.Group
  private replayStartPosition: { x: number; y: number } = { x: 0, y: 0 }

  // private tcrpRecorder!: TcrpRecorder
  // private tcrpPlayer!: TcrpPlayer
  // private stepRunner!: StepRunner

  constructor() {
    super('game')
  }

  preload() {}

  create() {
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

    // const tcrpPlugin = this.plugins.get('rexTCRP') as TCRPPlugin
    // this.tcrpRecorder = tcrpPlugin.addRecorder(this)
    // this.tcrpPlayer = tcrpPlugin.addPlayer(this)
    // this.stepRunner = tcrpPlugin.addStepRunner(this)

    this.player = new Player(this, 50, 500, {
      up: {
        down: () => {
          this.currentReplayer?.addCommand('jump')
          // if (this.tcrpRecorder.isRecording) {
          //   const command = ['jump']
          //   this.tcrpRecorder.addCommand(command)
          //   this.stepRunner.add(command, this.player)
          // }
        },
        up: () => {
          // if (this.tcrpRecorder.isRecording) {
          //   const command = ['stopMovingX']
          //   this.tcrpRecorder.addCommand(command)
          //   this.stepRunner.add(command, this.player)
          // }
        },
        pressed: () => {},
      },
      down: {
        down: () => {
          // if (this.tcrpRecorder.isRecording) {
          //   const command = ['fall']
          //   this.tcrpRecorder.addCommand(command)
          //   this.stepRunner.add(command, this.player)
          // }
        },
        up: () => {
          // if (this.tcrpRecorder.isRecording) {
          //   const command = ['stopMovingX']
          //   this.tcrpRecorder.addCommand(command)
          //   this.stepRunner.add(command, this.player)
          // }
        },
        pressed: () => {
          this.currentReplayer?.addCommand('fall')
          // if (this.tcrpRecorder.isRecording) {
          //   const command = ['fall']
          //   this.tcrpRecorder.addCommand(command)
          //   this.stepRunner.add(command, this.player)
          // }
        },
      },
      left: {
        down: () => {
          // if (this.tcrpRecorder.isRecording) {
          //   const command = ['moveLeft']
          //   this.tcrpRecorder.addCommand(command)
          //   this.stepRunner.add(command, this.player)
          // }
        },
        up: () => {
          // if (this.tcrpRecorder.isRecording) {
          //   const command = ['stopMovingX']
          //   this.tcrpRecorder.addCommand(command)
          //   this.stepRunner.add(command, this.player)
          // }
        },
        pressed: () => {
          this.currentReplayer?.addCommand('moveLeft')
          // if (this.tcrpRecorder.isRecording) {
          //   const command = ['moveLeft']
          //   this.tcrpRecorder.addCommand(command)
          //   this.stepRunner.add(command, this.player)
          // }
        },
      },
      right: {
        down: () => {
          // if (this.tcrpRecorder.isRecording) {
          //   const command = ['moveRight']
          //   this.tcrpRecorder.addCommand(command)
          //   this.stepRunner.add(command, this.player)
          // }
        },
        up: () => {
          // if (this.tcrpRecorder.isRecording) {
          //   console.log('~~~ [right] stopMovingX')
          //   const command = ['stopMovingX']
          //   this.tcrpRecorder.addCommand(command)
          //   this.stepRunner.add(command, this.player)
          // }
        },
        pressed: () => {
          this.currentReplayer?.addCommand('moveRight')
          // if (this.tcrpRecorder.isRecording) {
          //   const command = ['moveRight']
          //   this.tcrpRecorder.addCommand(command)
          //   this.stepRunner.add(command, this.player)
          // }
        },
      },
      onHorizontalNeutral: () => {
        this.currentReplayer?.addCommand('stopMovingX')
        // if (this.tcrpRecorder.isRecording) {
        //   const command = ['stopMovingX']
        //   this.tcrpRecorder.addCommand(command)
        //   this.stepRunner.add(command, this.player)
        // }
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
      } else {
        this.endRecordingAndStartReplay()
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
      'double jump',
    )

    // replay.setPushable(true)
    // replay.setImmovable(true)

    this.replays.add(replay)

    currentReplayer.startReplay(replay, {
      onLoopComplete: () => {
        replay.resetPosition()
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
