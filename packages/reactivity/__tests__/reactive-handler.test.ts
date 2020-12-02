import { Reactivity } from '../lib';

describe('@lothric/reactivity/reactive-handler.ts (base test case)', () => {
  let defaultMembrane: Reactivity;
  beforeEach(() => {
    defaultMembrane = new Reactivity();
  });

  it('should be idempotent', () => {
    const raw = { a: 1 };

    const wet1 = defaultMembrane.reactive(raw);
    const wet2 = defaultMembrane.reactive(raw);
    expect(wet1).toStrictEqual(wet2);
    expect(wet1.a).toStrictEqual(wet2.a);
  });

  it('should cache proxy', () => {
    const raw = { a: 1 };

    const wet1 = defaultMembrane.reactive(raw);
    const wet2 = defaultMembrane.reactive(wet1);
    expect(wet1).toStrictEqual(wet2);
    expect(wet1.a).toStrictEqual(wet2.a);
  });

  it('should handle frozen objects correctly', () => {
    const raw = Object.freeze({ a: 1 });

    const wet = defaultMembrane.reactive(raw);
    expect(() => {
      wet.a;
    }).not.toThrowError();
    expect(() => {
      wet.a = 2;
    }).toThrowError();
  });

  it('should handle deep nested mutations correctly', () => {
    const wet = defaultMembrane.reactive({});
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
  let defaultMembrane: Reactivity;
  beforeEach(() => {
    defaultMembrane = new Reactivity();
  });

  it('should handle has correctly', () => {
    const raw = { a: 1 };

    const wet = defaultMembrane.reactive(raw);
    expect('a' in wet);
  });

  it('should handle delete correctly', () => {
    const raw = { a: 1 };

    const wet = defaultMembrane.reactive(raw);
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

    const wet = defaultMembrane.reactive(raw);
    Object.defineProperty(wet, 'b', { value: 2 });
    expect(wet.b).toBe(2);
  });

  it('should assign same property with value on original object', () => {
    const raw = { a: 1 };

    const wet = defaultMembrane.reactive(raw);
    Object.defineProperty(wet, 'b', { value: 2 });
  });

  it('should handle Object.defineProperty correctly with undefined non-configurable descriptor', () => {
    const raw = { a: 1 };

    const wet = defaultMembrane.reactive(raw);
    Object.defineProperty(wet, 'b', {
      value: undefined,
      configurable: false,
    });
    expect(wet.b).toBe(undefined);
    expect(() => {
      wet.b = 2;
    }).toThrowError();
  });

  it('should handle Object.defineProperty correctly with non-configurable descriptor', () => {
    const raw = { a: 1 };

    const wet = defaultMembrane.reactive(raw);
    Object.defineProperty(wet, 'b', {
      value: 2,
      configurable: false,
    });
    expect(wet.b).toBe(2);
    expect(() => {
      wet.b = 3;
    }).toThrowError();
  });

  it('should not allow deleting non-configurable property', () => {
    const raw = { a: 1 };

    const wet = defaultMembrane.reactive(raw);
    Object.defineProperty(wet, 'b', {
      value: 2,
      configurable: false,
    });

    expect(() => {
      delete wet.b;
    }).toThrowError();
  });

  it('should not allow re-defining non-configurable property', () => {
    const raw = { a: 1 };

    const wet = defaultMembrane.reactive(raw);
    Object.defineProperty(wet, 'b', {
      value: 2,
      configurable: false,
    });
    expect(() => {
      Object.defineProperty(wet, 'b', {
        value: 3,
        configurable: true,
      });
    }).toThrowError();
  });

  it('shoud handle Object.isExtensible correctly', () => {
    const raw = { a: 1 };

    const wet = defaultMembrane.reactive(raw);
    expect(Object.isExtensible(wet)).toBeTruthy();
  });

  it('should handle Object.preventExtensions correctly', () => {
    const raw = { a: 1 };

    const wet = defaultMembrane.reactive(raw);
    expect(() => {
      Object.preventExtensions(wet);
    }).not.toThrow();
    expect(() => {
      wet.b = 2;
    }).toThrow();
    expect(wet.a).toBe(1);
  });

  it('should throw error when user invoke Object.setPrototypeOf', () => {
    const raw = { a: 1 };
    const newProto = { b: 2 };

    const wet = defaultMembrane.reactive(raw);
    expect(() => {
      Object.setPrototypeOf(wet, newProto);
    }).toThrowError();
  });

  it('should handle Object.getOwnPropertyNames correctly', () => {
    const raw = { a: 1 };

    const wet = defaultMembrane.reactive(raw);
    const names = Object.getOwnPropertyNames(wet);
    expect(names.length).toBe(1);
    expect(names[0]).toBe('a');
  });

  it('should handle Object.getOwnPropertyNames correctly when object has symbol', () => {
    const sym = Symbol();
    const raw = {
      [sym]: 'value of symbol key',
    };

    const wet = defaultMembrane.reactive(raw);
    const names = Object.getOwnPropertyNames(wet);
    expect(names.length).toBe(0);
  });

  it('should handle Object.getOwnPropertyNames correctly when object has key and symbol', () => {
    const sym = Symbol();
    const raw = {
      a: 1,
      [sym]: 'value of symbol key',
    };

    const wet = defaultMembrane.reactive(raw);
    const names = Object.getOwnPropertyNames(wet);
    expect(names.length).toBe(1);
    expect(names[0]).toBe('a');
  });

  it('should handle Object.getOwnPropertySymbols correctly', () => {
    const sym = Symbol();
    const raw = { [sym]: 'value of symbol key' };

    const wet = defaultMembrane.reactive(raw);
    expect(Object.getOwnPropertySymbols(wet)).toEqual([sym]);
  });

  it('should handle Object.getOwnPropertySymbols correctly when object has key', () => {
    const raw = { a: 1 };

    const wet = defaultMembrane.reactive(raw);
    const symbols = Object.getOwnPropertySymbols(wet);
    expect(symbols.length).toEqual(0);
  });

  it('should handle Object.getOwnPropertySymbols correctly when object has key and symbol', () => {
    const sym = Symbol();
    const raw = {
      a: 1,
      [sym]: 'value of symbol key',
    };

    const wet = defaultMembrane.reactive(raw);
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

    const wet = defaultMembrane.reactive(raw);
    expect(Object.keys(wet)).toStrictEqual(['a']);
  });

  it('should return reactive proxy when access property value via data descriptor', () => {
    const raw1 = { a: 1 };
    const raw2 = { b: 2 };

    Object.defineProperty(raw1, 'raw2', {
      value: raw2,
      configurable: true,
    });
    const reactiveRaw1 = defaultMembrane.reactive(raw1);
    const reactiveRaw2 = defaultMembrane.reactive(raw2);
    expect(reactiveRaw1.raw2).toStrictEqual(reactiveRaw2);

    const descriptor = Object.getOwnPropertyDescriptor(reactiveRaw1, 'raw2');
    expect(descriptor!.value!).toStrictEqual(reactiveRaw2);
  });

  it('should return reactive proxy when access property value via accessor descriptor', () => {
    const raw1 = { a: 1 };
    const raw2 = { b: 2 };

    Object.defineProperty(raw1, 'raw2', {
      get() {
        return raw2;
      },
      configurable: true,
    });
    const reactiveRaw1 = defaultMembrane.reactive(raw1);
    const reactiveRaw2 = defaultMembrane.reactive(raw2);
    expect(reactiveRaw1.raw2).toStrictEqual(reactiveRaw2);

    const descriptor = Object.getOwnPropertyDescriptor(reactiveRaw1, 'raw2');
    expect(descriptor!.get!()).toStrictEqual(reactiveRaw2);
  });

  it('should allow user set invocation via descriptor', () => {
    const raw = { a: 1 };
    let num = 2;
    const newNum = 3;

    Object.defineProperty(raw, 'num', {
      get() {
        return num;
      },
      set(v) {
        num = v;
      },
      configurable: true,
    });
    const wet = defaultMembrane.reactive(raw);
    const descriptor = Object.getOwnPropertyDescriptor(wet, 'num');
    const set = descriptor!.set!;
    const get = descriptor!.get!;
    set.call(wet, newNum);
    expect((raw as any).num).toEqual(newNum);
    expect(wet.num).toEqual(get.call(wet));
  });

  it('should allow user handle property value via descriptor which only have getter/setter', () => {
    const raw = { a: 1 };
    let num = 2;

    const wet = defaultMembrane.reactive(raw);
    Object.defineProperty(wet, 'b', {
      get() {
        return num;
      },
      set(v: number) {
        num = v;
      },
      configurable: true,
    });
    const descriptor = Object.getOwnPropertyDescriptor(raw, 'b');
    const set = descriptor!.set!;
    const get = descriptor!.get!;
    expect(get.call(wet)).toEqual(2);
    set.call(wet, 3);
    expect(get.call(wet)).toEqual(3);
  });
});

describe('@lothric/reactivity/reactive-handler.ts (Array)', () => {
  let defaultMembrane: Reactivity;
  beforeEach(() => {
    defaultMembrane = new Reactivity();
  });

  it('should wrap Array correctly', () => {
    const raw: any[] = [];

    const wet = defaultMembrane.reactive(raw);
    expect(wet).not.toBe(raw);
  });

  it('shoud allow access item in array', () => {
    const raw = [1, 2];

    const wet = defaultMembrane.reactive(raw);
    expect(Array.isArray(wet)).toBe(true);
    expect(wet.length).toBe(2);
    expect(wet[0]).toBe(1);
    expect(wet[1]).toBe(2);
  });

  it('should allow check index in array', () => {
    const raw = [1, 2];

    const wet = defaultMembrane.reactive(raw);
    expect(0 in wet).toBe(true);
  });

  it('should allow delete item in array', () => {
    const raw = [1, 2];

    const wet = defaultMembrane.reactive(raw);
    delete wet[0];
    expect(wet[0]).toBeUndefined();
    expect(raw[0]).toBeUndefined();
  });

  it('should handle Object.keys function correctly', () => {
    const raw = [1];

    const wet = defaultMembrane.reactive(raw);
    expect(Object.keys(wet)).toStrictEqual(['0']);
  });

  it('should allow change item in array', () => {
    const raw = [1, 2];

    const wet = defaultMembrane.reactive(raw);
    expect(Array.isArray(wet)).toBe(true);
    expect(() => {
      raw[0] = 3;
    }).not.toThrowError();
    expect(raw[0]).toBe(3);
  });

  it('should allow access length descriptor', () => {
    const raw = [1];

    const wet = defaultMembrane.reactive(raw);
    expect(Array.isArray(wet)).toBe(true);
    expect(Object.getOwnPropertyDescriptor(wet, 'length')!.value).toBe(1);
    wet.length = 2;
    expect(Object.getOwnPropertyDescriptor(wet, 'length')!.value).toBe(2);
    wet[2] = 3;
    expect(Object.getOwnPropertyDescriptor(wet, 'length')!.value).toBe(3);
    expect(wet[2]).toBe(3);
  });

  it('should trigger observer when values accessed', () => {
    const raw = [1, 2];
    const accessObs = jest.fn();
    const membrane = new Reactivity({
      accessObserver: accessObs,
    });

    const wet = membrane.reactive(raw);
    wet[0];
    wet[1];
    expect(accessObs).toHaveBeenCalledTimes(2);
    expect(accessObs).toHaveBeenCalledWith(wet, '0');
    expect(accessObs).toHaveBeenCalledWith(wet, '1');
  });

  it('should trigger observer when values mutated', () => {
    const raw = [1, 2];
    const mutationObs = jest.fn();
    const membrane = new Reactivity({
      mutationObserver: mutationObs,
    });

    const wet = membrane.reactive(raw);
    wet[0] = '3';
    wet[1] = '4';
    expect(mutationObs).toHaveBeenCalledTimes(2);
    expect(mutationObs).toHaveBeenCalledWith(wet, '0');
    expect(mutationObs).toHaveBeenCalledWith(wet, '1');
    expect(wet[0]).toBe('3');
    expect(wet[1]).toBe('4');
  });

  it('should handle Array.indexOf function correctly', () => {
    const raw = ['Spike', 'Jet', 'Faye', 'Edward'];
    const accessObs = jest.fn();
    const mutationObs = jest.fn();
    const membrane = new Reactivity({
      accessObserver: accessObs,
      mutationObserver: mutationObs,
    });

    const wet = membrane.reactive(raw);
    expect(wet.indexOf('Faye')).toBe(2);
    expect(wet.includes('Edward')).toBe(true);
    expect(wet.includes('Ein')).toBe(false);
    expect(wet.lastIndexOf('Jet')).toBe(1);
    expect(wet.lastIndexOf('Ein', 1)).toBe(-1);
    expect(mutationObs).toHaveBeenCalledTimes(0);
  });

  describe('Handle Array.prototype function', () => {
    let accessObs: jest.Mock<any, any>;
    let mutationObs: jest.Mock<any, any>;
    let defaultMembrane: Reactivity;
    beforeEach(() => {
      accessObs = jest.fn();
      mutationObs = jest.fn();
      defaultMembrane = new Reactivity({
        accessObserver: accessObs,
        mutationObserver: mutationObs,
      });
    });

    it('should hanlde Array.push function correctly', () => {
      const raw: any[] = [];

      const wet = defaultMembrane.reactive(raw);
      expect(() => {
        wet.push(1);
      }).not.toThrowError();
      expect(accessObs).toHaveBeenCalledTimes(2);
      expect(wet[0]).toEqual(1);
      expect(Object.getOwnPropertyDescriptor(wet, 'length')!.value).toEqual(1);
      expect(accessObs).toHaveBeenCalledWith(wet, '0');
      expect(accessObs).toHaveBeenCalledWith(wet, 'length');
      expect(mutationObs).toHaveBeenCalledWith(wet, '0');
      expect(mutationObs).toHaveBeenCalledTimes(1);
    });

    it('should handle Array.pop function correctly', () => {
      const raw = [1, 2];

      const wet = defaultMembrane.reactive(raw);
      expect(wet.pop()).toEqual(2);
      expect(mutationObs).toHaveBeenCalledTimes(2);
      expect(mutationObs).toHaveBeenCalledWith(wet, 'length');
      expect(mutationObs).toHaveBeenCalledWith(wet, '1');
    });

    it('should handle Array.unshift function correctly', () => {
      const raw = [1, 2];

      const wet = defaultMembrane.reactive(raw);
      expect(() => {
        wet.unshift(3);
      }).not.toThrowError();
      expect(wet[0]).toEqual(3);
      expect(Object.getOwnPropertyDescriptor(wet, 'length')!.value).toEqual(3);
      // so this is a fucking thing.
      expect(mutationObs).toHaveBeenCalledTimes(3);
    });

    it('should handle Array.shift function correctly', () => {
      const raw = [1, 2];

      const wet = defaultMembrane.reactive(raw);
      expect(() => {
        wet.shift();
      }).not.toThrowError();
      expect(wet[0]).toEqual(2);
      expect(Object.getOwnPropertyDescriptor(wet, 'length')!.value).toEqual(1);
      expect(mutationObs).toHaveBeenCalledTimes(3);
    });
  });
});
