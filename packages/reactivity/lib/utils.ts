export function isUndefined(obj: any): obj is undefined {
  return obj === undefined;
}

export const extend = <T extends object, U extends object>(a: T, b: U): T & U => {
  for (const key in b) {
    (a as any)[key] = b[key];
  }
  return a as any;
};
