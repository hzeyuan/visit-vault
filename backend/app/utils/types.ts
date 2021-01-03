export type Dictionary<T> = Record<string, T>;

export function isNumber(i: unknown): i is number {
  return typeof i === "number";
}

export function isBoolean(i: unknown): i is boolean {
  return typeof i === "boolean";
}
export function isRegExp(regStr: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new RegExp(regStr);
    return true;
  } catch (e) {
    return false;
  }
}

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
