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

  it('should handle repetitive prefix nodes', () => {
    const elm1 = renderChildren([1, 2, 3, 4]);
    expect(elm1.children.length).toBe(4);
    expect(getChildrenKeys(elm1)).toStrictEqual([1, 2, 3, 4]);

    const elm2 = renderChildren([1, 2, 3, 5]);
    expect(elm2.children.length).toBe(4);
    expect(getChildrenKeys(elm2)).toStrictEqual([1, 2, 3, 5]);
  });
});
