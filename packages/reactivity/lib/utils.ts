const {
  getPrototypeOf,
  create: ObjectCreate,
  defineProperty: ObjectDefineProperty,
  isExtensible,
  getOwnPropertyDescriptor,
  getOwnPropertyNames,
  getOwnPropertySymbols,
  preventExtensions,
  hasOwnProperty,
} = Object;
const { push: ArrayPush, concat: ArrayConcat } = Array.prototype;

export {
  getPrototypeOf,
  ObjectCreate,
  ObjectDefineProperty,
  isExtensible,
  getOwnPropertyDescriptor,
  getOwnPropertyNames,
  getOwnPropertySymbols,
  preventExtensions,
  hasOwnProperty,
  ArrayPush,
  ArrayConcat,
};

export function isUndefined(obj: any): obj is undefined {
  return obj === undefined;
}

export const extend = <T extends object, U extends object>(a: T, b: U): T & U => {
  for (const key in b) {
    (a as any)[key] = b[key];
  }
  return a as any;
};

export const isProduction = () => process.env.NODE_ENV === 'production';

/* Mark proxy with value */
type ReactiveProxy = object;
type MaybeProxy = any;
const proxyMap: WeakMap<ReactiveProxy, any> = new WeakMap();

export function registerProxy(proxy: ReactiveProxy, value: any) {
  proxyMap.set(proxy, value);
}

export function unwrapValue(original: MaybeProxy) {
  return proxyMap.get(original) || original;
}
