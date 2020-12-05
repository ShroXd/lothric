import { h } from '../lib/h';
import { Fragment, Portal, VNodeFlags } from '../lib/vnode';

describe('@lothric/renderer/h.ts (base test case)', () => {
  it('should handle sel correctly', () => {
    const vnode = h('div');
    expect(vnode).toStrictEqual({
      sel: 'div',
      flag: VNodeFlags.ELEMENT_HTML,
      elm: undefined,
      data: undefined,
      children: undefined,
    });
  });

  it('should handle data correctly', () => {
    const data = { class: 'container' };
    const vnode = h('div', data);
    expect(vnode).toStrictEqual({
      sel: 'div',
      flag: VNodeFlags.ELEMENT_HTML,
      elm: undefined,
      data,
      children: undefined,
    });
  });

  it('should handle single children correctly', () => {
    const data = { style: { color: 'red' } };
    const vnode = h('div', data, h('span'));
    expect(vnode).toStrictEqual({
      sel: 'div',
      flag: VNodeFlags.ELEMENT_HTML,
      elm: undefined,
      data,
      children: [
        {
          sel: 'span',
          flag: VNodeFlags.ELEMENT_HTML,
          elm: undefined,
          data: undefined,
          children: undefined,
        },
      ],
    });
  });

  it('should handle override params', () => {
    const vnode = h('div', h('span'));
    expect(vnode).toStrictEqual({
      sel: 'div',
      flag: VNodeFlags.ELEMENT_HTML,
      elm: undefined,
      data: undefined,
      children: [
        {
          sel: 'span',
          flag: VNodeFlags.ELEMENT_HTML,
          elm: undefined,
          data: undefined,
          children: undefined,
        },
      ],
    });
  });

  it('should handle multi children correctly', () => {
    const vnode = h('div', [h('span'), h('span')]);
    expect(vnode).toStrictEqual({
      sel: 'div',
      flag: VNodeFlags.ELEMENT_HTML,
      elm: undefined,
      data: undefined,
      children: [
        {
          sel: 'span',
          flag: VNodeFlags.ELEMENT_HTML,
          elm: undefined,
          data: undefined,
          children: undefined,
        },
        {
          sel: 'span',
          flag: VNodeFlags.ELEMENT_HTML,
          elm: undefined,
          data: undefined,
          children: undefined,
        },
      ],
    });
  });

  it('should handle multi children with data correctly', () => {
    const data = { style: { color: 'red' } };
    const vnode = h('div', data, [h('span'), h('span')]);
    expect(vnode).toStrictEqual({
      sel: 'div',
      flag: VNodeFlags.ELEMENT_HTML,
      elm: undefined,
      data,
      children: [
        {
          sel: 'span',
          flag: VNodeFlags.ELEMENT_HTML,
          elm: undefined,
          data: undefined,
          children: undefined,
        },
        {
          sel: 'span',
          flag: VNodeFlags.ELEMENT_HTML,
          elm: undefined,
          data: undefined,
          children: undefined,
        },
      ],
    });
  });
});

describe('@lothric/renderer/h.ts (base test case)', () => {
  it('should handle svg flag correctly', () => {
    const vnode = h('svg');
    expect(vnode.flag).toBe(VNodeFlags.ELEMENT_SVG);
  });

  it('should handle fragment flag correctly', () => {
    const vnode = h(Fragment);
    expect(vnode.flag).toBe(VNodeFlags.FRAGMENT);
  });

  it('should handle protal correctly', () => {
    const vnode = h(Portal);
    expect(vnode.flag).toBe(VNodeFlags.PORTAL);
  });
});
