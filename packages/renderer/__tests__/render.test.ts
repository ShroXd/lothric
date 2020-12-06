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
});
