import { ReactiveHandler } from './reactive-handler';
import { ReadOnlyHandler } from './read-only-handler';

export class ShallowReactiveHandler extends ReactiveHandler {
  public readonly _isShallow = true;
  transmitValueWrap(value: any): any {
    return value;
  }
}

export class ShallowReadOnlyHandler extends ReadOnlyHandler {
  public readonly _isShallow = true;
  transmitValueWrap(value: any): any {
    return value;
  }
}
