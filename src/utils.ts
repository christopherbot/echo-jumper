export const removeNil = <T>(array: T[]) =>
  array.filter(
    (item): item is NonNullable<T> => item !== undefined && item !== null,
  )

export type OnlyClassMethods<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? K : never
}[keyof T]
