import { Reactivity } from '../lib';

describe('@lothric/reactivity/read-only-handler.ts (base test case)', () => {
  let defaultMembrane: Reactivity;
  beforeEach(() => {
    defaultMembrane = new Reactivity();
  });

  it('shoud be idempotent', () => {
    const raw = { a: 1 };

    const wet1 = defaultMembrane.readonly(raw);
    const wet2 = defaultMembrane.readonly(raw);
    expect(wet1).toStrictEqual(wet2);
    expect(wet1.a).toStrictEqual(wet2.a);
  });

  it('should cache proxy', () => {
    const raw = { a: 1 };

    const wet1 = defaultMembrane.readonly(raw);
    const wet2 = defaultMembrane.readonly(wet1);
    expect(wet1).toStrictEqual(wet2);
    expect(wet1.a).toStrictEqual(wet2.a);
  });

  it('should handle frozen objects correctly', () => {
    const raw = Object.freeze({ a: 1 });

    const wet = defaultMembrane.readonly(raw);
    expect(() => {
      wet.a;
    }).not.toThrowError();
    expect(() => {
      wet.a = 2;
    }).toThrowError();
  });

  it('should throw error when set new value', () => {
    const raw = { a: 1 };

    const wet = defaultMembrane.readonly(raw);
    expect(() => {
      wet.a = 2;
    }).toThrowError();
  });

  it('should throw error when define property', () => {
    const raw = { a: 1 };

    const wet = defaultMembrane.readonly(raw);
    expect(() => {
      Object.defineProperty(wet, 'b', { value: 2 });
    }).toThrowError();
  });

  it('should handle property descriptor with getter correctly', () => {
    const raw = { a: 1 };
    const v = { b: 2 };
    Object.defineProperty(raw, 'v', {
      get() {
        return v;
      },
      enumerable: true,
    });

    const wet = defaultMembrane.readonly(raw);
    const descriptor = Object.getOwnPropertyDescriptor(raw, 'v')!;
    expect(wet.v).toStrictEqual(v);
    expect(descriptor.get!.call(wet)).toStrictEqual(wet.v);
    expect(descriptor.get!.call(wet)).toStrictEqual(v);
  });

  it('should handle has correctly', () => {
    const raw = { a: 1 };

    const wet = defaultMembrane.readonly(raw);
    expect('a' in wet);
  });

  it('should handle extensible correctly', () => {
    // TODO should I make object extensible false?
    const raw = { a: 1 };

    const wet = defaultMembrane.readonly(raw);
    expect(Object.isExtensible(wet)).toBeTruthy();
  });

  it('should throw error when delete property', () => {
    const raw = { a: 1 };

    const wet = defaultMembrane.readonly(raw);
    expect(() => {
      delete wet['a'];
    }).toThrowError();
  });

  it('should throw error when set new prototype', () => {
    const raw = { a: 1 };

    const wet = defaultMembrane.readonly(raw);
    expect(() => {
      Object.setPrototypeOf(wet, {});
    }).toThrowError();
  });

  it('should throw error when set new prototype for object propertype', () => {
    const raw1 = { raw2: { a: 1 } };

    const wet = defaultMembrane.readonly(raw1);
    expect(() => {
      Object.setPrototypeOf(wet.raw2, {});
    }).toThrowError();
  });

  it('should throw error when prevent extensions', () => {
    const raw = { a: 1 };

    const wet = defaultMembrane.readonly(raw);
    expect(() => {
      Object.preventExtensions(wet);
    }).toThrowError();
  });

  it('should prevent change property value via setter in descriptor', () => {
    const raw = {};
    let value = 1;
    Object.defineProperty(raw, 'a', {
      get() {
        return value;
      },
      set(v) {
        value = v;
      },
      configurable: true,
    });

    const wet = defaultMembrane.readonly(raw);
    const descriptor = Object.getOwnPropertyDescriptor(wet, 'a');
    expect(() => {
      descriptor!.set!.call(wet, 2);
    }).toThrowError();
    expect(descriptor!.get!.call(wet)).toEqual(1);
  });

  it('should prevent change property value via getter in deacriptor', () => {
    const raw = {};
    Object.defineProperty(raw, 'a', {
      get() {
        return { b: 2 };
      },
      configurable: true,
    });

    const wet = defaultMembrane.readonly(raw);
    const descriptor = Object.getOwnPropertyDescriptor(wet, 'a');
    expect(() => {
      descriptor!.get!().b = 3;
    }).toThrowError();
  });
});
