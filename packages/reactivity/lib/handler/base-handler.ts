import { WrappedGetter, WrappedSetter } from '../helper';
import { Reactivity } from '../reactivity';

export type ShadowTarget = object;

export abstract class BaseHandler {
  membrane: Reactivity;
  originalTarget: any;

  constructor(membrane: Reactivity, originalTarget: any) {
    this.membrane = membrane;
    this.originalTarget = originalTarget;
  }

  // Base implement in ShareHandler
  abstract wrapValue(value: any): any;
  abstract wrapGetter(originalGet: WrappedGetter): WrappedGetter;
  abstract wrapSetter(originalSet: WrappedSetter): WrappedSetter;

  abstract construct(target: ShadowTarget, argsArray: any, newTarget?: any): any;
  abstract apply(target: ShadowTarget, thisArg: any, argsArray: any[]): any;
  abstract set(target: ShadowTarget, key: PropertyKey, value: any): boolean;
  abstract get(target: ShadowTarget, key: PropertyKey): any;
  abstract has(target: ShadowTarget, key: PropertyKey): any;
  abstract defineProperty(target: ShadowTarget, key: PropertyKey, descriptor: PropertyDescriptor): boolean;
  abstract deleteProperty(target: ShadowTarget, key: PropertyKey): boolean;
  abstract ownKeys(target: ShadowTarget): PropertyKey[];
  abstract setPrototypeOf(target: ShadowTarget, prototype: any): any;
  abstract getPrototypeOf(target: ShadowTarget): object;
  abstract isExtensible(target: ShadowTarget): boolean;
  abstract preventExtensions(target: ShadowTarget): boolean;
  abstract getOwnPropertyDescriptor(target: ShadowTarget, key: PropertyKey): PropertyDescriptor | undefined;
}
