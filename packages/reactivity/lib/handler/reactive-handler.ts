import { OriginalGetter, OriginalSetter, WrappedGetter, WrappedSetter } from '../helper';
import { isUndefined } from '../utils';
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
    const get = (self: any): any => {
      return handler.transmitValueWrap(originalGet.call(self));
    };
    getterMap.set(originalGet, get as WrappedGetter);
    revertGetterMap.set(get as WrappedGetter, originalGet);
    return get as WrappedGetter;
  }

  transmitSetterWrap(originalSet: OriginalSetter): WrappedSetter {
    const wrappedSetter = setterMap.get(originalSet);
    if (!isUndefined(wrappedSetter)) return wrappedSetter;

    const set = (self: any, value: any): void => {
      // TODO 包裹与解包 self value
      originalSet.call(self, value);
    };
    setterMap.set(originalSet, set as WrappedSetter);
    revertSetterMap.set(set as WrappedSetter, originalSet);
    return set as WrappedSetter;
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
    throw new Error('Method not implemented.');
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
    throw new Error('Method not implemented.');
  }
}
