import { ReactiveHandler } from './handler/reactive-handler';
import { ReadOnlyHandler } from './handler/read-only-handler';
import { RefHandler } from './handler/ref-handler';
import {
  AccessObserver,
  MutationObserver,
  DistortionHandler,
  defaultAccessObserver,
  defaultMutationObserver,
  defaultDistortionHandler,
  ReactivityOptions,
  defaultIsValueObservable,
  IsValueObservable,
} from './helper';
import { extend, isRef, isUndefined, registerProxy, unwrapValue } from './utils';

export class Reactivity {
  private objGraph: WeakMap<any, any> = new WeakMap();

  identification: PropertyKey | undefined;
  accessObserver: AccessObserver = defaultAccessObserver;
  mutationObserver: MutationObserver = defaultMutationObserver;
  distortionHandler: DistortionHandler = defaultDistortionHandler;
  isValueObservable: IsValueObservable = defaultIsValueObservable;

  constructor(options?: ReactivityOptions) {
    if (isUndefined(options)) return;
    extend(this, options);
  }

  reactive(value: any) {
    const unwrappedValue = unwrapValue(value);
    const distortedValue = this.distortionHandler(unwrappedValue);
    if (this.isValueObservable(distortedValue)) {
      const { objGraph } = this;
      const reactiveState = objGraph.get(distortedValue);
      if (reactiveState) return reactiveState;

      const reactiveHandler = new ReactiveHandler(this, distortedValue);
      const proxy = new Proxy(distortedValue, reactiveHandler);
      registerProxy(proxy, unwrappedValue);
      return proxy;
    }
    return distortedValue;
  }

  readonly(value: any) {
    const unwrappedValue = unwrapValue(value);
    const distortedValue = this.distortionHandler(unwrappedValue);
    if (this.isValueObservable(distortedValue)) {
      const { objGraph } = this;
      const readonlyState = objGraph.get(distortedValue);
      if (readonlyState) return readonlyState;

      const readonlyHandler = new ReadOnlyHandler(this, distortedValue);
      const proxy = new Proxy(distortedValue, readonlyHandler);
      registerProxy(proxy, unwrappedValue);
      return proxy;
    }
    return distortedValue;
  }

  ref(value: any) {
    const unwrappedValue = unwrapValue(value);
    const distortedValue = this.distortionHandler(unwrappedValue);
    if (isRef(distortedValue)) {
      return distortedValue;
    }

    const ref = new RefHandler(this, distortedValue);
    registerProxy(ref, unwrapValue);
    return ref;
  }

  shallowReactive(value: any) {
    // TODO
  }

  shallowReadonly(value: any) {
    // TODO
  }
}
