import { ReactiveHandler } from './handler/reactive-handler';
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
import { extend, isUndefined } from './utils';

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
    const distortedValue = this.distortionHandler(value);
    if (this.isValueObservable(distortedValue)) {
      const { objGraph } = this;
      const reactiveState = objGraph.get(distortedValue);
      if (reactiveState) return reactiveState;

      const reactiveHandler = new ReactiveHandler(this, distortedValue);
      return new Proxy(distortedValue, reactiveHandler);
    }
    return distortedValue;
  }

  readonly(value: any) {
    const distortedValue = this.distortionHandler(value);
    if (this.isValueObservable(distortedValue)) {
      // TODO return new proxy
    }
    return distortedValue;
  }

  ref(value: any) {
    // TODO
  }

  shallowReactive(value: any) {
    // TODO
  }

  shallowReadonly(value: any) {
    // TODO
  }
}
