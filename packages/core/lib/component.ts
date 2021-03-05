import { renderer } from 'packages/renderer/lib/render';

export class Component {
  private root: Element;
  private _render: any;
  private state: any;

  constructor() {
    this.root = document.getElementById('#app')!;
    this._render = renderer();
    this.state = this.getInitialState();
    this.update();
  }

  setState(state: any) {
    this.state = Object.assign(this.state || {}, state);
    this.update();
  }

  getInitialState() {
    return {};
  }

  update() {
    const newTree = this.render();
    this._render(newTree, this.root);
  }

  render() {
    return null;
  }
}
