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
    }).not.toThrow();
    expect(() => {
      wet.a = 2;
    }).toThrow();
  });

  it('should keep old relationship', () => {
    const raw: any = {
      a: {
        b: null,
      },
    };
    raw.a.b = raw;
    const membrane = new Reactivity();

    const wet = membrane.reactive(raw);
    expect(wet.a.b).toStrictEqual(wet);
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

  it('should handle defineProperty correctly', () => {
    const raw = { a: 1 };
    const membrane = new Reactivity();

    const wet = membrane.reactive(raw);
    Object.defineProperty(wet, 'b', { value: 2 });
    expect(wet.b).toBe(2);
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
