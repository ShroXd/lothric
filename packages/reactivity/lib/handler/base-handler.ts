import { OriginalGetter, OriginalSetter, WrappedGetter, WrappedSetter } from '../helper';
import { Reactivity } from '../reactivity';
import {
  ArrayPush,
  getOwnPropertyDescriptor,
  getOwnPropertyNames,
  getOwnPropertySymbols,
  getPrototypeOf,
  hasOwnProperty,
  isUndefined,
  ObjectDefineProperty,
} from '../utils';

export type ShadowTarget = object;

export abstract class BaseHandler {
  membrane: Reactivity;
  /* The originalTarget here is distorted value actually */
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
  abstract defineProperty(target: ShadowTarget, key: PropertyKey, descriptor: PropertyDescriptor): boolean;
  abstract deleteProperty(target: ShadowTarget, key: PropertyKey): boolean;
  abstract setPrototypeOf(target: ShadowTarget, prototype: any): any;
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
      membrane: { identification, accessObserver },
    } = this;
    accessObserver(originalTarget, key);
    return key in originalTarget || key === identification;
  }

  ownKeys(target: ShadowTarget): PropertyKey[] {
    const {
      originalTarget,
      membrane: { identification },
    } = this;
    const keys: PropertyKey[] =
      isUndefined(identification) || hasOwnProperty.call(originalTarget, identification) ? [] : [identification];
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
      membrane: { identification, accessObserver },
    } = this;
    accessObserver(originalTarget, key);
    let descriptor = getOwnPropertyDescriptor(originalTarget, key);

    /* handle identification */
    if (isUndefined(descriptor)) {
      if (key !== identification) return undefined;

      descriptor = { configurable: false, enumerable: false, value: undefined, writable: false };
      ObjectDefineProperty(target, identification, descriptor);
      return descriptor;
    }

    /* keep shadow target sync with original target */
    if (descriptor.configurable === false) {
      this.copyDescriptorIntoShadowTarget(target, key);
    }

    return this.wrapDescriptor(descriptor);
  }

  /* Shared utility methods */
  wrapDescriptor(descriptor: PropertyDescriptor): PropertyDescriptor {
    /* Handle value itself or getter & setter of value */
    if (hasOwnProperty.call(descriptor, 'value')) {
      descriptor.value = this.transmitValueWrap(descriptor.value);
    } else {
      const { set: originalSet, get: originalGet } = descriptor;
      if (!isUndefined(originalGet)) descriptor.get = this.transmitGetterWrap(originalGet);
      if (!isUndefined(originalSet)) descriptor.set = this.transmitSetterWrap(originalSet);
    }

    return descriptor;
  }

  copyDescriptorIntoShadowTarget(target: ShadowTarget, key: PropertyKey) {
    const { originalTarget } = this;
    const originalDescriptor = getOwnPropertyDescriptor(originalTarget, key);

    /* keep compatible */
    if (!isUndefined(originalDescriptor)) {
      const wrappedDescriptor = this.wrapDescriptor(originalDescriptor);
      ObjectDefineProperty(target, key, wrappedDescriptor);
    }
  }
}
