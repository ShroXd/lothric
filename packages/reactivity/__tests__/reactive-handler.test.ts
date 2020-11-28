import { Reactivity } from '../lib';

describe('@lothric/reactivity/reactive-handler.ts (base test case)', () => {
  it('should idempotent', () => {
    const raw = { a: 1 };
    const membrane = new Reactivity();

    const wet1 = membrane.reactive(raw);
    const wet2 = membrane.reactive(raw);
    expect(wet1).toStrictEqual(wet2);
    expect(wet1.a).toStrictEqual(wet2.a);
  });

  it('should cache proxy', () => {
    const raw = { a: 1 };
    const membrane = new Reactivity();

    const wet1 = membrane.reactive(raw);
    const wet2 = membrane.reactive(wet1);
    expect(wet1).toStrictEqual(wet2);
    expect(wet1.a).toStrictEqual(wet2.a);
  });

  it('should handle frozen objects correctly', () => {
    const raw = Object.freeze({ a: 1 });
    const membrane = new Reactivity();

    const wet = membrane.reactive(raw);
    expect(() => {
      wet.a;
    }).not.toThrowError();
    expect(() => {
      wet.a = 2;
    }).toThrowError();
  });

  it('should handle deep nested mutations correctly', () => {
    const membrane = new Reactivity();
    const wet = membrane.reactive({});
    expect(() => {
      wet.a = 1;
    }).not.toThrowError();
  });

  it('should trigger accessObserver when property is accessed', () => {
    const fn = jest.fn();
    const raw = { a: 1 };
    const membrane = new Reactivity({
      accessObserver: fn,
    });

    const wet = membrane.reactive(raw);
    wet.a;
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should trigger accessObserver when deep property is accessed', () => {
    const fn = jest.fn();
    const raw = {
      a: {
        b: 1,
      },
    };
    const membrane = new Reactivity({
      accessObserver: fn,
    });

    const wet = membrane.reactive(raw);
    wet.a.b;
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('@lothric/reactivity/reactive-handler.ts (handler)', () => {
  it('should handle has correctly', () => {
    const raw = { a: 1 };
    const membrane = new Reactivity();

    const wet = membrane.reactive(raw);
    expect('a' in wet);
  });

  it('should handle delete correctly', () => {
    const raw = { a: 1 };
    const membrane = new Reactivity();

    const wet = membrane.reactive(raw);
    expect('a' in wet).toBeTruthy();
    delete wet.a;
    expect('a' in wet).not.toBeTruthy();

    Object.defineProperty(raw, 'b', { writable: false });
    expect('b' in wet).toBeTruthy();
    expect(() => {
      delete wet.b;
    }).toThrow();
  });

  it('should handle Object.defineProperty correctly', () => {
    const raw = { a: 1 };
    const membrane = new Reactivity();

    const wet = membrane.reactive(raw);
    Object.defineProperty(wet, 'b', { value: 2 });
    expect(wet.b).toBe(2);
  });

  it('shoud handle Object.isExtensible correctly', () => {
    const raw = { a: 1 };
    const membrane = new Reactivity();

    const wet = membrane.reactive(raw);
    expect(Object.isExtensible(wet)).toBeTruthy();
  });

  it('should handle Object.preventExtensions correctly', () => {
    const raw = { a: 1 };
    const membrane = new Reactivity();

    const wet = membrane.reactive(raw);
    expect(() => {
      Object.preventExtensions(wet);
    }).not.toThrow();
    expect(() => {
      wet.b = 2;
    }).toThrow();
    expect(wet.a).toBe(1);
  });

  it('should handle Object.getOwnPropertyNames correctly', () => {
    const raw = { a: 1 };
    const membrane = new Reactivity();

    const wet = membrane.reactive(raw);
    const names = Object.getOwnPropertyNames(wet);
    expect(names.length).toBe(1);
    expect(names[0]).toBe('a');
  });

  it('should handle Object.getOwnPropertyNames correctly when object has symbol', () => {
    const sym = Symbol();
    const raw = {
      [sym]: 'value of symbol key',
    };
    const membrane = new Reactivity();

    const wet = membrane.reactive(raw);
    const names = Object.getOwnPropertyNames(wet);
    expect(names.length).toBe(0);
  });

  it('should handle Object.getOwnPropertyNames correctly when object has key and symbol', () => {
    const sym = Symbol();
    const raw = {
      a: 1,
      [sym]: 'value of symbol key',
    };
    const membrane = new Reactivity();

    const wet = membrane.reactive(raw);
    const names = Object.getOwnPropertyNames(wet);
    expect(names.length).toBe(1);
    expect(names[0]).toBe('a');
  });

  it('should handle Object.getOwnPropertySymbols correctly', () => {
    const sym = Symbol();
    const raw = { [sym]: 'value of symbol key' };
    const membrane = new Reactivity();

    const wet = membrane.reactive(raw);
    expect(Object.getOwnPropertySymbols(wet)).toEqual([sym]);
  });

  it('should handle Object.getOwnPropertySymbols correctly when object has key', () => {
    const raw = { a: 1 };
    const membrane = new Reactivity();

    const wet = membrane.reactive(raw);
    const symbols = Object.getOwnPropertySymbols(wet);
    expect(symbols.length).toEqual(0);
  });

  it('should handle Object.getOwnPropertySymbols correctly when object has key and symbol', () => {
    const sym = Symbol();
    const raw = {
      a: 1,
      [sym]: 'value of symbol key',
    };
    const membrane = new Reactivity();

    const wet = membrane.reactive(raw);
    const symbols = Object.getOwnPropertySymbols(wet);
    expect(symbols.length).toEqual(1);
    expect(symbols[0]).toEqual(sym);
  });

  it('should handle Object.keys when object has symbol and key', () => {
    const sym = Symbol();
    const raw = {
      a: 1,
      [sym]: 'value of symbol key',
    };
    const membrane = new Reactivity();

    const wet = membrane.reactive(raw);
    expect(Object.keys(wet)).toStrictEqual(['a']);
  });
});

describe('@lothric/reactivity/reactive-handler.ts (Array)', () => {
  it('should handle Array correctly', () => {
    const raw: any[] = [];
    const membrane = new Reactivity();

    const wet = membrane.reactive(raw);
    expect(wet).not.toBe(raw);
  });
});
