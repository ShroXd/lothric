import { WrappedGetter, WrappedSetter } from '../helper';
import { Reactivity } from '../reactivity';
import { ArrayPush, getOwnPropertyNames, getOwnPropertySymbols, getPrototypeOf } from '../utils';

export type ShadowTarget = object;

export abstract class BaseHandler {
  membrane: Reactivity;
  originalTarget: any;

  constructor(membrane: Reactivity, originalTarget: any) {
    this.membrane = membrane;
    this.originalTarget = originalTarget;
  }

  /* Base implement in ShareHandler */
  abstract transmitValueWrap(value: any): any;
  abstract transmitGetterWrap(originalGet: WrappedGetter): WrappedGetter;
  abstract transmitSetterWrap(originalSet: WrappedSetter): WrappedSetter;

  abstract set(target: ShadowTarget, key: PropertyKey, value: any): boolean;
  // abstract get(target: ShadowTarget, key: PropertyKey): any;
  // abstract has(target: ShadowTarget, key: PropertyKey): any;
  abstract defineProperty(target: ShadowTarget, key: PropertyKey, descriptor: PropertyDescriptor): boolean;
  abstract deleteProperty(target: ShadowTarget, key: PropertyKey): boolean;
  // abstract ownKeys(target: ShadowTarget): PropertyKey[];
  abstract setPrototypeOf(target: ShadowTarget, prototype: any): any;
  // abstract getPrototypeOf(target: ShadowTarget): object;
  // abstract isExtensible(target: ShadowTarget): boolean;
  abstract preventExtensions(target: ShadowTarget): boolean;
  abstract getOwnPropertyDescriptor(target: ShadowTarget, key: PropertyKey): PropertyDescriptor | undefined;

  apply(target: ShadowTarget, thisArg: any, argsArray: any[]): any {
    // nothing
  }

  construct(target: ShadowTarget, argsArray: any, newTarget?: any): any {
    // nothing
  }

  get(target: ShadowTarget, key: PropertyKey): any {
    const {
      originalTarget,
      membrane: { accessObserver },
    } = this;
    const value = originalTarget[key];
    accessObserver(value);
    return this.transmitValueWrap(value);
  }

  has(target: ShadowTarget, key: PropertyKey): boolean {
    const {
      originalTarget,
      membrane: { accessObserver },
    } = this;
    accessObserver(originalTarget, key);
    return key in originalTarget;
  }

  ownKeys(target: ShadowTarget): PropertyKey[] {
    const { originalTarget } = this;
    const keys: PropertyKey[] = [];
    ArrayPush(keys, getOwnPropertyNames(originalTarget));
    ArrayPush(keys, getOwnPropertySymbols(originalTarget));
    return keys;
  }

  getPrototypeOf(target: ShadowTarget): object {
    const { originalTarget } = this;
    return getPrototypeOf(originalTarget);
  }

  isExtensible(target: ShadowTarget): boolean {
    return true;
  }
}
