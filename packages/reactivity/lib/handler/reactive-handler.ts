import { OriginalGetter, OriginalSetter, WrappedGetter, WrappedSetter } from '../helper';
import {
  hasOwnProperty,
  isExtensible,
  isUndefined,
  ObjectDefineProperty,
  preventExtensions,
  unwrapValue,
} from '../utils';
import { BaseHandler } from './base-handler';

const getterMap = new WeakMap<OriginalGetter, WrappedGetter>();
const setterMap = new WeakMap<OriginalSetter, WrappedSetter>();
const revertGetterMap = new WeakMap<WrappedGetter, OriginalGetter>();
const revertSetterMap = new WeakMap<WrappedSetter, OriginalSetter>();

export class ReactiveHandler extends BaseHandler {
  transmitValueWrap(value: any): any {
    return this.membrane.reactive(value);
  }

  transmitGetterWrap(originalGet: OriginalGetter): WrappedGetter {
    const wrappedGetter = getterMap.get(originalGet);
    if (!isUndefined(wrappedGetter)) return wrappedGetter;

    const handler = this;
    const get = function (): any {
      return handler.transmitValueWrap(originalGet.call(this));
    };
    getterMap.set(originalGet, get as WrappedGetter);
    revertGetterMap.set(get as WrappedGetter, originalGet);
    return get as WrappedGetter;
  }

  transmitSetterWrap(originalSet: OriginalSetter): WrappedSetter {
    const wrappedSetter = setterMap.get(originalSet);
    if (!isUndefined(wrappedSetter)) return wrappedSetter;

    const set = function (value: any): void {
      /* this depends on caller*/
      originalSet.call(this, value);
    };
    setterMap.set(originalSet, set as WrappedSetter);
    revertSetterMap.set(set as WrappedSetter, originalSet);
    return set as WrappedSetter;
  }

  unwrapDescriptor(descriptor: PropertyDescriptor): PropertyDescriptor {
    /* Handle getter & setter of value */
    if (hasOwnProperty.call(descriptor, 'value')) {
      descriptor.value = unwrapValue(descriptor.value);
    } else {
      const { set: originalSet, get: originalGet } = descriptor;
      if (!isUndefined(originalGet)) descriptor.get = this.unwrapGetter(originalGet);
      if (!isUndefined(originalSet)) descriptor.set = this.unwrapSetter(originalSet);
    }

    return descriptor;
  }

  unwrapGetter(g: WrappedGetter): OriginalGetter {
    const revertGetter = revertGetterMap.get(g);
    if (!isUndefined(revertGetter)) return revertGetter;

    const handler = this;
    const get = function (): any {
      return g.call(handler.transmitValueWrap(this));
    };
    getterMap.set(get as OriginalGetter, g);
    revertGetterMap.set(g, get as OriginalGetter);
    return get as OriginalGetter;
  }

  unwrapSetter(s: WrappedSetter): OriginalSetter {
    const revertSetter = revertSetterMap.get(s);
    if (!isUndefined(revertSetter)) return revertSetter;

    const handler = this;
    const set = function (value: any): void {
      s.call(handler.transmitValueWrap(this), handler.transmitValueWrap(value));
    };
    setterMap.set(set as OriginalSetter, s);
    revertSetterMap.set(s, set as OriginalSetter);

    return set as OriginalSetter;
  }

  set(target: object, key: PropertyKey, value: any): boolean {
    const {
      originalTarget,
      membrane: { mutationObserver },
    } = this;
    const oldValue = originalTarget[key];
    if (oldValue !== value) {
      originalTarget[key] = value;
      mutationObserver(originalTarget, key);
    }
    return true;
  }

  defineProperty(target: object, key: PropertyKey, descriptor: PropertyDescriptor): boolean {
    const {
      originalTarget,
      membrane: { identification, mutationObserver },
    } = this;

    /* Protect our identification */
    if (key === identification && !hasOwnProperty.call(originalTarget, key)) return true;
    ObjectDefineProperty(originalTarget, key, this.unwrapDescriptor(descriptor));
    if (descriptor.configurable === false) {
      this.copyDescriptorIntoShadowTarget(target, key);
    }
    mutationObserver(originalTarget, key);
    return true;
  }

  deleteProperty(target: object, key: PropertyKey): boolean {
    const {
      originalTarget,
      membrane: { mutationObserver },
    } = this;
    delete originalTarget[key];
    mutationObserver(originalTarget, key);
    return true;
  }

  setPrototypeOf(target: object, prototype: any): any {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(`You can't set new prototype for reactive object: ${this.originalTarget}`);
    }
  }

  preventExtensions(target: object): boolean {
    if (isExtensible(target)) {
      const { originalTarget } = this;
      preventExtensions(originalTarget);
      this.preventShadowTargetExtensions(target);
    }
    return true;
  }
}
