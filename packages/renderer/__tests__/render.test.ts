import { renderer } from '../lib/render';
import { h } from '../lib/h';
import { Fragment, Portal } from '../lib/vnode';

const triggerEvent = (type: string, elm: Element) => {
  const event = new Event(type);
  elm.dispatchEvent(event);
};

describe('@lothric/renderer/render.ts (render element)', () => {
  let root: Element;
  let render: any;
  beforeEach(() => {
    root = document.createElement('div');
    render = renderer();
  });

  it('should create an element', () => {
    render(h('span'), root);
    expect(root.innerHTML).toBe('<span></span>');
  });

  it('should create an element with class name', () => {
    render(h('span', { class: 'title' }), root);
    expect(root.innerHTML).toBe('<span class="title"></span>');
  });

  it('should create an element with style', () => {
    render(
      h('span', {
        style: {
          fontSize: '12px',
          color: 'red',
          backgroundColor: 'gold',
        },
      }),
      root,
    );
    expect(root.innerHTML).toBe('<span style="font-size: 12px; color: red; background-color: gold;"></span>');
  });

  it('should create an element with custom attributes', () => {
    render(h('div', { custom: 'attr' }), root);
    expect(root.innerHTML).toBe('<div custom="attr"></div>');
  });

  it('should create an element with DOM properties', () => {
    render(
      h('input', {
        type: 'checkbox',
        checked: true,
      }),
      root,
    );
    expect(root.innerHTML).toBe('<input type="checkbox">');
  });

  it('should create an element with event', () => {
    const fn = jest.fn();
    render(h('button', { class: 'myBtn', onClick: fn }), root);
    triggerEvent('click', root.querySelector('.myBtn')!);
    expect(fn).toHaveBeenCalled();
  });

  it('should allow all lower case event name', () => {
    const fn = jest.fn();
    render(h('button', { class: 'myBtn', onclick: fn }), root);
    triggerEvent('click', root.querySelector('.myBtn')!);
    expect(fn).toHaveBeenCalled();
  });
});

describe('@lothric/renderer/render.ts (render text)', () => {
  let root: Element;
  let render: any;
  beforeEach(() => {
    root = document.createElement('div');
    render = renderer();
  });

  it('should create a text node', () => {
    render(h('span', 'I am a text'), root);
    expect(root.innerHTML).toBe('<span>I am a text</span>');
  });
});

describe('@lothric/renderer/render.ts (render fragment)', () => {
  let root: Element;
  let render: any;
  beforeEach(() => {
    root = document.createElement('div');
    render = renderer();
  });

  it('should render fragment with single child', () => {
    render(h(Fragment, h('span')), root);
    expect(root.innerHTML).toBe('<span></span>');
  });

  it('should render fragment with multi children', () => {
    render(h(Fragment, [h('div'), h('span')]), root);
    expect(root.innerHTML).toBe('<div></div><span></span>');
  });
});

describe('@lothric/renderer/render.ts (render fragment)', () => {
  let root: Element;
  let render: any;
  beforeEach(() => {
    root = document.createElement('div');
    render = renderer();
  });

  it('should render portal with single child', () => {
    render(h(Portal, h('span')), root);
    expect(root.innerHTML).toBe('<span></span>');
  });

  it('should render portal with target', () => {
    const vnode = h('div', { class: 'root' }, h(Portal, { target: '#portal' }, [h('span'), h('span')]));
    render(vnode, root);
    expect(root.innerHTML).toBe('<div class="root"></div><span></span><span></span>');
  });
});

describe('@lothric/renderer/render.ts (patch & unmount)', () => {
  let root: Element;
  let render: any;
  beforeEach(() => {
    root = document.createElement('div');
    render = renderer();
  });

  it('should replace vnode for defferent type vnode', () => {
    render(h('span'), root);
    expect(root.innerHTML).toBe('<span></span>');
    render(h(Fragment, h('div')), root);
    expect(root.innerHTML).toBe('<div></div>');
  });

  it('should patch element style correctly', () => {
    const vnode1 = h('div', {
      class: 'title',
      style: {
        color: 'red',
      },
    });
    const vnode2 = h('div', {
      class: 'title',
      style: {
        color: 'blue',
      },
    });
    render(vnode1, root);
    expect(root.children[0].getAttribute('style')).toBe('color: red;');
    render(vnode2, root);
    expect(root.children[0].getAttribute('style')).toBe('color: blue;');
  });

  it('should patch text node correctly', () => {
    const vnode1 = h('span', 'first text');
    const vnode2 = h('span', 'second text');
    render(vnode1, root);
    expect(root.firstElementChild!.innerHTML).toBe('first text');
    render(vnode2, root);
    expect(root.firstElementChild!.innerHTML).toBe('second text');
  });

  it('should unmount vnode correctly', () => {
    render(h('span'), root);
    expect(root.innerHTML).toBe('<span></span>');
    render(null, root);
    expect(root.innerHTML).toBe('');
    expect((root as any).vnode).toBeNull();
  });
});

describe('@lothric/renderer/render.ts (patch children)', () => {
  let root: Element;
  let render: any;
  beforeEach(() => {
    root = document.createElement('div');
    render = renderer();
  });

  it('should handle NO_CHILD -> NO_CHILD', () => {
    const vnode1 = h('div');
    const vnode2 = h('div');
    expect(() => {
      render(vnode1, root);
      render(vnode2, root);
    }).not.toThrowError();
  });

  it('should handle NO_CHILD -> SINGLE_CHILD', () => {
    const vnode1 = h('div');
    const vnode2 = h('div', h('div', { class: 'title' }));
    render(vnode1, root);
    expect(root.innerHTML).toBe('<div></div>');
    render(vnode2, root);
    expect(root.innerHTML).toBe('<div></div><div class="title"></div>');
  });

  it('should handle NO_CHILD -> MULTI_CHILD', () => {
    const vnode1 = h('div');
    const vnode2 = h('div', [h('h1'), h('h1')]);
    render(vnode1, root);
    expect(root.innerHTML).toBe('<div></div>');
    render(vnode2, root);
    expect(root.innerHTML).toBe('<div></div><h1></h1><h1></h1>');
  });

  it('should handle SINGLE_CHILD -> NO_CHILD', () => {
    const vnode1 = h('div', h('span'));
    const vnode2 = h('div');
    render(vnode1, root);
    expect(root.innerHTML).toBe('<div></div><span></span>');
    render(vnode2, root);
    expect(root.innerHTML).toBe('<div></div>');
  });

  it('should handle SINGLE_CHILD -> SINGLE_CHILD', () => {
    const vnode1 = h('div', h('h1'));
    const vnode2 = h('div', h('h2'));
    render(vnode1, root);
    expect(root.innerHTML).toBe('<div></div><h1></h1>');
    render(vnode2, root);
    expect(root.innerHTML).toBe('<div></div><h2></h2>');
  });

  it('should handle SINGLE_CHILD -> MULTI_CHILDREN', () => {
    const vnode1 = h('div', h('h1'));
    const vnode2 = h('div', [h('h2'), h('h3')]);
    render(vnode1, root);
    expect(root.innerHTML).toBe('<div></div><h1></h1>');
    render(vnode2, root);
    expect(root.innerHTML).toBe('<div></div><h2></h2><h3></h3>');
  });

  it('should handle MULTI_CHILDREN -> NO_CHILD', () => {
    const vnode1 = h('div', [h('h1'), h('h2'), h('h3')]);
    const vnode2 = h('div');
    render(vnode1, root);
    expect(root.innerHTML).toBe('<div></div><h1></h1><h2></h2><h3></h3>');
    render(vnode2, root);
    expect(root.innerHTML).toBe('<div></div>');
  });

  it('should handle MULTI_CHILDREN -> SINGLE_CHILD', () => {
    const vnode1 = h('div', [h('h1'), h('h2'), h('h3')]);
    const vnode2 = h('div');
    render(vnode1, root);
    expect(root.innerHTML).toBe('<div></div><h1></h1><h2></h2><h3></h3>');
    render(vnode2, root);
    expect(root.innerHTML).toBe('<div></div>');
  });
});
