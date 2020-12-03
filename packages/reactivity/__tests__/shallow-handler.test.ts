import { Reactivity } from '../lib';

describe('@lothric/reactivity/shallow-reactive-handler.ts', () => {
  let defaultMembrane: Reactivity;
  beforeEach(() => {
    defaultMembrane = new Reactivity();
  });

  it('should be idempotent', () => {
    const raw = { a: 1 };

    const wet1 = defaultMembrane.shallowReactive(raw);
    const wet2 = defaultMembrane.shallowReactive(raw);
    expect(wet1).toStrictEqual(wet2);
    expect(wet1.a).toStrictEqual(wet2.a);
  });

  it('should cache proxy', () => {
    const raw = { a: 1 };

    const wet1 = defaultMembrane.shallowReactive(raw);
    const wet2 = defaultMembrane.shallowReactive(wet1);
    expect(wet1).toStrictEqual(wet2);
    expect(wet1.a).toStrictEqual(wet2.a);
  });

  it('should handle frozen objects correctly', () => {
    const raw = Object.freeze({ a: 1 });

    const wet = defaultMembrane.shallowReactive(raw);
    expect(() => {
      wet.a;
    }).not.toThrowError();
    expect(() => {
      wet.a = 2;
    }).toThrowError();
  });

  it('should not trigger mutation observer when change deep nested property value', () => {
    const raw = {
      a: { c: 2 },
      b: 1,
    };
    const fn = jest.fn();
    const membrane = new Reactivity({
      mutationObserver: fn,
    });

    const wet = membrane.shallowReactive(raw);
    wet.a.c = 4;
    expect(wet.a.c).toEqual(4);
    expect(fn).not.toHaveBeenCalled();
    wet.b = 3;
    expect(wet.b).toEqual(3);
    expect(fn).toHaveReturnedTimes(1);
  });
});

describe('@lothric/reactivity/shallow-readonly-handler.ts', () => {
  let defaultMembrane: Reactivity;
  beforeEach(() => {
    defaultMembrane = new Reactivity();
  });

  it('should be idempotent', () => {
    const raw = { a: 1 };

    const wet1 = defaultMembrane.shallowReadonly(raw);
    const wet2 = defaultMembrane.shallowReadonly(raw);
    expect(wet1).toStrictEqual(wet2);
    expect(wet1.a).toStrictEqual(wet2.a);
  });

  it('should cache proxy', () => {
    const raw = { a: 1 };

    const wet1 = defaultMembrane.shallowReadonly(raw);
    const wet2 = defaultMembrane.shallowReadonly(wet1);
    expect(wet1).toStrictEqual(wet2);
    expect(wet1.a).toStrictEqual(wet2.a);
  });

  it('should handle frozen object correctly', () => {
    const raw = Object.freeze({ a: 1 });

    const wet = defaultMembrane.shallowReadonly(raw);
    expect(() => {
      wet.a;
    }).not.toThrowError();
    expect(() => {
      wet.a = 2;
    }).toThrowError();
  });

  it('should throw error when set new value', () => {
    const raw = { a: 1 };

    const wet = defaultMembrane.shallowReadonly(raw);
    expect(() => {
      wet.a = 2;
    }).toThrowError();
  });

  it('should not handle deep nested property', () => {
    const raw = {
      a: { b: 1 },
      c: 2,
    };

    const wet = defaultMembrane.shallowReadonly(raw);
    expect(() => {
      wet.c = 3;
    }).toThrowError();
    expect(() => {
      wet.a.b = 4;
    }).not.toThrowError();
  });
});
