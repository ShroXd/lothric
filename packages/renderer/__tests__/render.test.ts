import { renderer } from '../lib/render';
import { h } from '../lib/h';

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
