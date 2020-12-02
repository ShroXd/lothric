import { Reactivity } from '../lib';

describe('@lothric/reactivity/ref-handler.ts (base test case)', () => {
  it('should be idempotent', () => {
    const raw = 1;
    const membrane = new Reactivity();

    const wet1 = membrane.ref(raw);
    const wet2 = membrane.ref(raw);
    expect(wet1).toStrictEqual(wet2);
    expect(wet1.value).toStrictEqual(wet2.value);
  });

  it('should cache proxy', () => {
    const raw = 1;
    const membrane = new Reactivity();

    const wet1 = membrane.ref(raw);
    const wet2 = membrane.ref(wet1);
    expect(wet1).toStrictEqual(wet2);
    expect(wet1.value).toStrictEqual(wet2.value);
  });

  it('should trigger access observer correctly', () => {
    const fn = jest.fn();
    const raw = 1;
    const membrane = new Reactivity({
      accessObserver: fn,
    });

    const wet = membrane.ref(raw);
    expect(() => {
      wet.value;
    }).not.toThrowError();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should trigger mutation observer correctly', () => {
    const fn = jest.fn();
    const raw = 1;
    const membrane = new Reactivity({
      mutationObserver: fn,
    });

    const wet = membrane.ref(raw);
    expect(() => {
      wet.value = 2;
    }).not.toThrowError();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
