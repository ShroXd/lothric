import { OriginalGetter, OriginalSetter, WrappedGetter, WrappedSetter } from '../helper';
import { isProduction, isUndefined } from '../utils';
import { BaseHandler } from './base-handler';

const getterMap = new WeakMap<OriginalGetter, WrappedGetter>();
const setterMap = new WeakMap<OriginalSetter, WrappedSetter>();

export class ReadOnlyHandler extends BaseHandler {
  transmitValueWrap(value: any) {
    return this.membrane.readonly(value);
  }

  transmitGetterWrap(originalGet: OriginalGetter): WrappedGetter {
    const wrappedGetter = getterMap.get(originalGet);
    if (!isUndefined(wrappedGetter)) return wrappedGetter;

    const handler = this;
    const get = function (): any {
      // TODO should I unwrap 'this' object?
      return handler.transmitValueWrap(originalGet.call(this));
    };
    getterMap.set(originalGet, get);
    return get;
  }

  transmitSetterWrap(originalSet: OriginalSetter): WrappedSetter {
    const wrappedSetter = setterMap.get(originalSet);
    if (!isUndefined(wrappedSetter)) return wrappedSetter;

    const handler = this;
    const set = function (value: any): void {
      if (!isProduction()) {
        throw new Error(`You can't set a new value for read only constant: ${handler.originalTarget}`);
      }
    };
    setterMap.set(originalSet, set);
    return set;
  }

  set(target: object, key: string | number | symbol, value: any): boolean {
    if (!isProduction()) {
      throw new Error(`You can't set a new value for read only constant: ${this.originalTarget}`);
    }
    return false;
  }

  defineProperty(target: object, key: string | number | symbol, descriptor: PropertyDescriptor): boolean {
    if (!isProduction()) {
      throw new Error(`You can't define ${key.toString()} for read only constant: ${this.originalTarget}`);
    }
    return false;
  }

  deleteProperty(target: object, key: string | number | symbol): boolean {
    if (!isProduction()) {
      throw new Error(`You can't delete property ${key.toString()} of read only constant: ${this.originalTarget}`);
    }
    return false;
  }

  setPrototypeOf(target: object, prototype: any): any {
    if (!isProduction()) {
      throw new Error(`You can't set new prototype for read only object: ${this.originalTarget}`);
    }
  }

  preventExtensions(target: object): boolean {
    if (!isProduction()) {
      throw new Error(`You can't prevent extensions for read only object: ${this.originalTarget}`);
    }
    return false;
  }
}
