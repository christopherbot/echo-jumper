import type { Component } from '@src/components'

class Entity extends Phaser.Physics.Arcade.Sprite {
  components: Map<string, Component> = new Map()

  addComponent(component: Component) {
    this.components.set(component.name, component)
  }

  removeComponent(name: string) {
    this.components.delete(name)
  }

  update() {
    this.components.forEach((component) => {
      component.update()
    })
  }

  teardown() {
    this.components.forEach((component) => {
      component.teardown()
    })
  }
}

export default Entity
