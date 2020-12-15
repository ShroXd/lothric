import { h } from '../lib/h';
import { renderer } from '../lib/render';

function toSpan(content: any) {
  if (typeof content === 'string') {
    return h('span', content.toString());
  } else {
    return h('span', { key: content }, content.toString());
  }
}

function getChildrenKeys(elm: Element) {
  const keys: any[] = [];
  Object.keys(elm.children).map((k) => {
    const key = elm.children[k].getAttribute('key');
    keys.push(parseInt(key));
  });
  return keys;
}

describe('@lothric/renderer/render.ts (diff)', () => {
  let root: Element;
  let render = renderer();
  const renderChildren = (arr: Array<number>): Element => {
    const vnode = h('div', arr.map(toSpan));
    render(vnode, root);
    return root.children[0] as Element;
  };

  beforeEach(() => {
    root = document.createElement('div');
  });

  test('repetitive prefix nodes', () => {
    const elm1 = renderChildren([1, 2, 3, 4]);
    expect(elm1.children.length).toBe(4);
    expect(getChildrenKeys(elm1)).toStrictEqual([1, 2, 3, 4]);

    const elm2 = renderChildren([1, 2, 3, 5]);
    expect(elm2.children.length).toBe(4);
    expect(getChildrenKeys(elm2)).toStrictEqual([1, 2, 3, 5]);
  });

  test('repetitive suffix nodes', () => {
    const elm1 = renderChildren([4, 1, 2, 3]);
    expect(elm1.children.length).toBe(4);
    expect(getChildrenKeys(elm1)).toStrictEqual([4, 1, 2, 3]);

    const elm2 = renderChildren([5, 1, 2, 3]);
    expect(elm2.children.length).toBe(4);
    expect(getChildrenKeys(elm2)).toStrictEqual([5, 1, 2, 3]);
  });

  test('insert end', () => {
    const elm1 = renderChildren([1, 2, 3, 4]);
    expect(elm1.children.length).toBe(4);
    expect(getChildrenKeys(elm1)).toStrictEqual([1, 2, 3, 4]);

    const elm2 = renderChildren([1, 2, 3, 4, 5, 6]);
    expect(elm2.children.length).toBe(6);
    expect(getChildrenKeys(elm2)).toStrictEqual([1, 2, 3, 4, 5, 6]);
  });

  test('insert before', () => {
    const elm1 = renderChildren([1, 2, 3, 4]);
    expect(elm1.children.length).toBe(4);
    expect(getChildrenKeys(elm1)).toStrictEqual([1, 2, 3, 4]);

    const elm2 = renderChildren([5, 6, 1, 2, 3, 4]);
    expect(elm2.children.length).toBe(6);
    expect(getChildrenKeys(elm2)).toStrictEqual([5, 6, 1, 2, 3, 4]);
  });

  test('insert in middle', () => {
    const elm1 = renderChildren([1, 2, 3, 4]);
    expect(elm1.children.length).toBe(4);
    expect(getChildrenKeys(elm1)).toStrictEqual([1, 2, 3, 4]);

    const elm2 = renderChildren([1, 2, 5, 6, 3, 4]);
    expect(elm2.children.length).toBe(6);
    expect(getChildrenKeys(elm2)).toStrictEqual([1, 2, 5, 6, 3, 4]);
  });

  test('insert at beginning & end', () => {
    const elm1 = renderChildren([1, 2, 3, 4]);
    expect(elm1.children.length).toBe(4);
    expect(getChildrenKeys(elm1)).toStrictEqual([1, 2, 3, 4]);

    const elm2 = renderChildren([5, 6, 1, 2, 3, 4, 7, 8]);
    // expect(elm2.children.length).toBe(8);
    expect(getChildrenKeys(elm2)).toStrictEqual([5, 6, 1, 2, 3, 4, 7, 8]);
  });

  test('remove from beginning', () => {
    const elm1 = renderChildren([1, 2, 3, 4, 5]);
    expect(elm1.children.length).toBe(5);
    expect(getChildrenKeys(elm1)).toStrictEqual([1, 2, 3, 4, 5]);

    const elm2 = renderChildren([3, 4, 5]);
    expect(elm2.children.length).toBe(3);
    expect(getChildrenKeys(elm2)).toStrictEqual([3, 4, 5]);
  });

  test('remove from end', () => {
    const elm1 = renderChildren([1, 2, 3, 4, 5]);
    expect(elm1.children.length).toBe(5);
    expect(getChildrenKeys(elm1)).toStrictEqual([1, 2, 3, 4, 5]);

    const elm2 = renderChildren([1, 2, 3]);
    expect(elm2.children.length).toBe(3);
    expect(getChildrenKeys(elm2)).toStrictEqual([1, 2, 3]);
  });

  test('remove from middle', () => {
    const elm1 = renderChildren([1, 2, 3, 4, 5]);
    expect(elm1.children.length).toBe(5);
    expect(getChildrenKeys(elm1)).toStrictEqual([1, 2, 3, 4, 5]);

    const elm2 = renderChildren([1, 2, 4, 5]);
    expect(elm2.children.length).toBe(4);
    expect(getChildrenKeys(elm2)).toStrictEqual([1, 2, 4, 5]);
  });
});
