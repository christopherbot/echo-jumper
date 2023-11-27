import type TCRPPlugin from 'phaser3-rex-plugins/plugins/arcadetcrp-plugin.js'
import type TcrpPlayer from 'phaser3-rex-plugins/plugins/logic/runcommands/arcadetcrp/Player'
import type TcrpRecorder from 'phaser3-rex-plugins/plugins/logic/runcommands/arcadetcrp/Recorder'
import type StepRunner from 'phaser3-rex-plugins/plugins/logic/runcommands/arcadetcrp/StepRunner'

import { Character, Player } from '@src/entities'

import BaseScene from './BaseScene'

class Game extends BaseScene {
  private player!: Player
  // private replays: Character[] = []
  private replays!: Phaser.Physics.Arcade.Group
  private replayPosition: { x: number; y: number } = { x: 0, y: 0 }

  private tcrpRecorder!: TcrpRecorder
  private tcrpPlayer!: TcrpPlayer
  private stepRunner!: StepRunner

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

    const tcrpPlugin = this.plugins.get('rexTCRP') as TCRPPlugin
    this.tcrpRecorder = tcrpPlugin.addRecorder(this)
    this.tcrpPlayer = tcrpPlugin.addPlayer(this)
    this.stepRunner = tcrpPlugin.addStepRunner(this)

    this.player = new Player(this, 50, 500, {
      up: {
        down: () => {
          if (this.tcrpRecorder.isRecording) {
            const command = ['jump']
            this.tcrpRecorder.addCommand(command)
            this.stepRunner.add(command, this.player)
          }
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
          if (this.tcrpRecorder.isRecording) {
            const command = ['fall']
            this.tcrpRecorder.addCommand(command)
            this.stepRunner.add(command, this.player)
          }
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
          if (this.tcrpRecorder.isRecording) {
            const command = ['moveLeft']
            this.tcrpRecorder.addCommand(command)
            this.stepRunner.add(command, this.player)
          }
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
          if (this.tcrpRecorder.isRecording) {
            const command = ['moveRight']
            this.tcrpRecorder.addCommand(command)
            this.stepRunner.add(command, this.player)
          }
        },
      },
      onHorizontalNeutral: () => {
        if (this.tcrpRecorder.isRecording) {
          const command = ['stopMovingX']
          this.tcrpRecorder.addCommand(command)
          this.stepRunner.add(command, this.player)
        }
      },
    })

    this.replays = this.physics.add.group({
      allowGravity: true,
      immovable: true,
      collideWorldBounds: true,
    })

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
      if (!this.tcrpRecorder.isRecording) {
        this.replayPosition = { x: this.player.x, y: this.player.y }
        this.tcrpRecorder.start()

        // const command = ['stopMovingX']
        const command = ['noop']
        this.tcrpRecorder.addCommand(command)
        this.stepRunner.add(command, this.player)

        this.tcrpPlayer.stop()
      } else {
        if (this.tcrpRecorder.isRecording) {
          const command = ['stopMovingX']
          this.tcrpRecorder.addCommand(command)
          this.stepRunner.add(command, this.player)
        }

        this.tcrpRecorder.stop()
        const commands = this.tcrpRecorder.getCommands()

        const replay = new Character(
          this,
          this.replayPosition.x,
          this.replayPosition.y,
          '',
        )
        // replay.setPushable(true)
        // replay.setImmovable(true)

        this.replays.add(replay)
        // this.replays.push(replay)

        this.tcrpPlayer.load(commands, replay).start()
      }
    })
  }

  update() {
    this.player.update()
  }
}

export default Game
