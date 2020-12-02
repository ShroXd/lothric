import { Reactivity } from '..';

export class RefHandler<T> {
  public readonly _isRef = true;
  private readonly membrane: Reactivity;
  private _rawValue: T;

  constructor(membrane: Reactivity, v: T) {
    this.membrane = membrane;
    this._rawValue = v;
  }

  get value() {
    const {
      membrane: { accessObserver },
    } = this;
    accessObserver(this._rawValue);
    return this._rawValue;
  }

  set value(v: T) {
    const {
      membrane: { mutationObserver },
    } = this;
    mutationObserver(v);
    this._rawValue = v;
  }
}
