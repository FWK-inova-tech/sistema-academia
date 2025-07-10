export type ReplaceDateWithString<T> = {
  [K in keyof T]: T[K] extends Date
    ? string
    : T[K] extends Array<infer U>
      ? Array<ReplaceDateWithString<U>>
      : T[K] extends object
        ? ReplaceDateWithString<T[K]>
        : T[K];
}
