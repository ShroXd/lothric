import { OriginalGetter, OriginalSetter, WrappedGetter, WrappedSetter } from '../helper';
import { Reactivity } from '../reactivity';
import {
  ArrayPush,
  getOwnPropertyDescriptor,
  getOwnPropertyNames,
  getOwnPropertySymbols,
  getPrototypeOf,
  isUndefined,
  ObjectDefineProperty,
} from '../utils';

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
  abstract transmitGetterWrap(originalGet: OriginalGetter): WrappedGetter;
  abstract transmitSetterWrap(originalSet: OriginalSetter): WrappedSetter;

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

  getOwnPropertyDescriptor(target: ShadowTarget, key: PropertyKey): PropertyDescriptor | undefined {
    const {
      originalTarget,
      membrane: { accessObserver },
    } = this;
    accessObserver(originalTarget, key);
    return getOwnPropertyDescriptor(originalTarget, key);
  }
}
