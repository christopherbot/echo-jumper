export type OnlyClassMethods<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? K : never
}[keyof T]

export function removeNil<T>(array: T[]) {
  return array.filter(
    (item): item is NonNullable<T> => item !== undefined && item !== null,
  )
}

export function assertNever(_value: never, message: string): never {
  throw new Error(message)
}
