import { Reactivity } from '../lib/reactivity';

describe('@lothric/reactivity/reactivity.ts', () => {
  it('should work without any config', () => {
    const raw = { a: 1 };
    const membrane = new Reactivity();
    const wet = membrane.reactive(raw);
    expect(wet.a).toBe(1);
  });

  it('should work with empty config', () => {
    const raw = { a: 1 };
    const membrane = new Reactivity({});
    const wet = membrane.reactive(raw);
    expect(wet.a).toBe(1);
  });

  it('should allow the user to control access behavior', () => {
    const raw = { a: 1 };
    const fn = jest.fn();
    const membrane = new Reactivity({
      accessObserver() {
        fn();
      },
    });

    const wet = membrane.reactive(raw);
    wet.a;
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should allow the user to control mutation behavior', () => {
    const raw = { a: 1 };
    const fn = jest.fn();
    const membrane = new Reactivity({
      mutationObserver() {
        fn();
      },
    });

    const wet = membrane.reactive(raw);
    wet.a;
    expect(fn).not.toHaveBeenCalled();
    wet.a = 'new value';
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should allow the user to control distortion behavior', () => {
    const raw = { a: 1 };
    const membrane = new Reactivity({
      distortionHandler() {
        return 'distorted value';
      },
    });

    const wet = membrane.reactive(raw);
    expect(wet).toBe('distorted value');
  });

  it('should allow the user to control membrane transmit', () => {
    const raw = { a: 1 };
    const membrane = new Reactivity({
      isValueObservable(value) {
        return false;
      },
    });

    const wet = membrane.reactive(raw);
    wet.x = 'new value';
    expect(wet).toStrictEqual(raw);
  });

  it('should support identification as string', () => {
    const raw = { a: 1 };
    const membrane = new Reactivity({
      identification: 'iden',
    });

    const wet = membrane.reactive(raw);
    expect('iden' in raw).toBe(false);
    expect('iden' in wet).toBe(true);
    expect(wet.iden).toBe(undefined);

    const names = Object.getOwnPropertyNames(wet);
    expect(names.length).toBe(2);
    expect(names[0]).toBe('iden');
  });

  it('should support identification as symbol', () => {
    const raw = { a: 1 };
    const iden = Symbol();
    const membrane = new Reactivity({
      identification: iden,
    });

    const wet = membrane.reactive(raw);
    expect(iden in raw).toBe(false);
    expect(iden in wet).toBe(true);
    expect(wet.iden).toBe(undefined);

    const names = Object.getOwnPropertySymbols(wet);
    expect(names.length).toBe(1);
    expect(names[0]).toBe(iden);
  });

  it('should trigger observer when access identification', () => {
    const raw = { a: 1 };
    const fn = jest.fn();
    const membrane = new Reactivity({
      identification: 'iden',
      accessObserver() {
        fn();
      },
    });

    const wet = membrane.reactive(raw);
    wet.iden;
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
