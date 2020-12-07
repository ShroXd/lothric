import { h } from '../lib/h';
import { ChildFlags, Fragment, Portal, VNodeFlags } from '../lib/vnode';

describe('@lothric/renderer/h.ts (base test case)', () => {
  it('should handle sel correctly', () => {
    const vnode = h('div');
    expect(vnode).toStrictEqual({
      sel: 'div',
      flag: VNodeFlags.ELEMENT_HTML,
      elm: undefined,
      data: undefined,
      children: undefined,
      childFlag: ChildFlags.NO_CHILDREN,
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
      childFlag: ChildFlags.NO_CHILDREN,
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
      children: {
        sel: 'span',
        flag: VNodeFlags.ELEMENT_HTML,
        elm: undefined,
        data: undefined,
        children: undefined,
        childFlag: ChildFlags.NO_CHILDREN,
      },
      childFlag: ChildFlags.SINGLE_CHILD,
    });
  });

  it('should handle override params', () => {
    const vnode = h('div', h('span'));
    expect(vnode).toStrictEqual({
      sel: 'div',
      flag: VNodeFlags.ELEMENT_HTML,
      elm: undefined,
      data: undefined,
      children: {
        sel: 'span',
        flag: VNodeFlags.ELEMENT_HTML,
        elm: undefined,
        data: undefined,
        children: undefined,
        childFlag: ChildFlags.NO_CHILDREN,
      },
      childFlag: ChildFlags.SINGLE_CHILD,
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
          childFlag: ChildFlags.NO_CHILDREN,
        },
        {
          sel: 'span',
          flag: VNodeFlags.ELEMENT_HTML,
          elm: undefined,
          data: undefined,
          children: undefined,
          childFlag: ChildFlags.NO_CHILDREN,
        },
      ],
      childFlag: ChildFlags.MULTI_CHILDREN,
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
          childFlag: ChildFlags.NO_CHILDREN,
        },
        {
          sel: 'span',
          flag: VNodeFlags.ELEMENT_HTML,
          elm: undefined,
          data: undefined,
          children: undefined,
          childFlag: ChildFlags.NO_CHILDREN,
        },
      ],
      childFlag: ChildFlags.MULTI_CHILDREN,
    });
  });

  it('should create an element with data & text child node', () => {
    const vnode = h('span', { class: 'title' }, 'I am a text');
    expect(vnode).toStrictEqual({
      sel: 'span',
      flag: VNodeFlags.ELEMENT_HTML,
      elm: undefined,
      data: { class: 'title' },
      children: 'I am a text',
      childFlag: ChildFlags.SINGLE_CHILD,
    });
  });

  it('should create an element with text child node', () => {
    const vnode = h('span', 'I am a text');
    expect(vnode.data).toBe(undefined);
    expect(vnode.children).toBe('I am a text');
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
