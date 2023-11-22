import type TCRPPlugin from 'phaser3-rex-plugins/plugins/arcadetcrp-plugin.js'
import type Player from 'phaser3-rex-plugins/plugins/logic/runcommands/arcadetcrp/Player'
import type Recorder from 'phaser3-rex-plugins/plugins/logic/runcommands/arcadetcrp/Recorder'

import type Component from './Component'

class Replay implements Component {
  name = 'replay'

  private recorder: Recorder
  private player: Player

  constructor(scene: Phaser.Scene) {
    const tcrpPlugin = scene.plugins.get('rexTCRP') as TCRPPlugin
    this.recorder = tcrpPlugin.addRecorder(scene)
    this.player = tcrpPlugin.addPlayer(scene)
    console.log('~~~ this.recorder', this.recorder)
    console.log('~~~ this.player', this.player)
  }

  start() {
    this.recorder.start()
  }

  update() {}
}

export default Replay
