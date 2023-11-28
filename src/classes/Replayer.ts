import type TCRPPlugin from 'phaser3-rex-plugins/plugins/arcadetcrp-plugin.js'
import type Player from 'phaser3-rex-plugins/plugins/logic/runcommands/arcadetcrp/Player'
import type Recorder from 'phaser3-rex-plugins/plugins/logic/runcommands/arcadetcrp/Recorder'

import type { OnlyClassMethods } from '@src/utils'

interface ReplayOptions {
  onLoopComplete: () => void
}

class Replayer<T extends object> {
  // Note: The TCRPPlugin also has a StepRunner class that is used in the
  // rex examples to sync the commands being added during recording with
  // the game world step counter. We don't need to use it this because the
  // player movement methods are being called directly already on input.
  private recorder: Recorder
  private player: Player

  constructor(scene: Phaser.Scene) {
    const tcrpPlugin = scene.plugins.get('rexTCRP') as TCRPPlugin
    this.recorder = tcrpPlugin.addRecorder(scene)
    this.player = tcrpPlugin.addPlayer(scene)
  }

  startRecording() {
    this.recorder.start()
  }

  stopRecording() {
    this.recorder.stop()
  }

  addCommand(commandName: OnlyClassMethods<T>) {
    if (this.isRecording) {
      this.recorder.addCommand([commandName])
    }
  }

  startReplay(scope: T, options: ReplayOptions) {
    const commands = this.recorder.getCommands()
    this.player.load(commands, scope)
    this.player.start()

    // continuously loop the replay
    this.player.on('complete', () => {
      options.onLoopComplete()
      this.player.start()
    })
  }

  stopReplay() {
    this.player.stop()
    this.player.off('complete')
  }

  get isRecording() {
    return this.recorder.isRecording
  }

  get isReplaying() {
    return this.player.isPlaying
  }

  teardown() {
    this.stopRecording()
    this.stopReplay()
  }
}

export default Replayer
