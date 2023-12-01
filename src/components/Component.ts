abstract class Component {
  abstract name: string

  abstract update(): void
  abstract teardown(): void
}

export default Component
