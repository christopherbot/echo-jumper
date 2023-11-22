// eslint-disable-next-line import/prefer-default-export
export const removeNil = <T>(array: T[]) =>
  array.filter(
    (item): item is NonNullable<T> => item !== undefined && item !== null,
  )
