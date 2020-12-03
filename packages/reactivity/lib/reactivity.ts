import { ReactiveHandler } from './handler/reactive-handler';
import { ReadOnlyHandler } from './handler/read-only-handler';
import { RefHandler } from './handler/ref-handler';
import { ShallowReactiveHandler, ShallowReadOnlyHandler } from './handler/shallow-handler';
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
import { extend, isRef, isShallow, isUndefined, registerProxy, unwrapValue } from './utils';

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
    if (!this.isValueObservable(distortedValue)) return distortedValue;

    const { objGraph } = this;
    const reactiveState = objGraph.get(distortedValue);
    if (reactiveState) return reactiveState;

    const reactiveHandler = new ReactiveHandler(this, distortedValue);
    const proxy = new Proxy(distortedValue, reactiveHandler);
    registerProxy(proxy, unwrappedValue);
    return proxy;
  }

  readonly(value: any) {
    const unwrappedValue = unwrapValue(value);
    const distortedValue = this.distortionHandler(unwrappedValue);
    if (!this.isValueObservable(distortedValue)) return distortedValue;

    const { objGraph } = this;
    const readonlyState = objGraph.get(distortedValue);
    if (readonlyState) return readonlyState;

    const readonlyHandler = new ReadOnlyHandler(this, distortedValue);
    const proxy = new Proxy(distortedValue, readonlyHandler);
    registerProxy(proxy, unwrappedValue);
    return proxy;
  }

  ref(value: any) {
    const unwrappedValue = unwrapValue(value);
    const distortedValue = this.distortionHandler(unwrappedValue);
    if (isRef(distortedValue)) return distortedValue;

    const ref = new RefHandler(this, distortedValue);
    registerProxy(ref, distortedValue);
    return ref;
  }

  shallowReactive(value: any) {
    const unwrappedValue = unwrapValue(value);
    const distortedValue = this.distortionHandler(unwrappedValue);
    if (isShallow(distortedValue)) return distortedValue;

    const { objGraph } = this;
    const shallowReactiveState = objGraph.get(distortedValue);
    if (shallowReactiveState) return shallowReactiveState;

    const shallowReactiveHandler = new ShallowReactiveHandler(this, distortedValue);
    const proxy = new Proxy(distortedValue, shallowReactiveHandler);
    registerProxy(proxy, unwrappedValue);
    return proxy;
  }

  shallowReadonly(value: any) {
    const unwrappedValue = unwrapValue(value);
    const distortedValue = this.distortionHandler(unwrappedValue);
    if (isShallow(distortedValue)) return distortedValue;

    const { objGraph } = this;
    const shallowReadonlyState = objGraph.get(distortedValue);
    if (shallowReadonlyState) return shallowReadonlyState;

    const shallowReadonlyHandler = new ShallowReadOnlyHandler(this, distortedValue);
    const proxy = new Proxy(distortedValue, shallowReadonlyHandler);
    registerProxy(proxy, unwrappedValue);
    return proxy;
  }
}
