import { getRenderPreset } from './renderOptions';
import { VNode, VNodeFlags } from './vnode';

export function renderer() {
  const options = getRenderPreset();
  return createRenderer(options);
}

function createRenderer(options: any): any {
  const patch = (prevVNode: VNode, nextVNode: VNode, container: any) => {
    const prevFlag = prevVNode.flag;
    const nextFlag = nextVNode.flag;

    if (prevFlag !== nextFlag) {
      replaceVNode(prevVNode, nextVNode, container);
    } else if (nextFlag & VNodeFlags.ELEMENT) {
      patchElement(prevVNode, nextVNode, container);
    } else if (nextFlag & VNodeFlags.TEXT) {
      patchText(prevVNode, nextVNode, container);
    } else if (nextFlag & VNodeFlags.FRAGMENT) {
      patchFragment(prevVNode, nextVNode, container);
    } else if (nextFlag & VNodeFlags.PORTAL) {
      patchPortal(prevVNode, nextVNode, container);
    } else if (nextFlag & VNodeFlags.COMPONENT) {
      patchComponent(prevVNode, nextVNode, container);
    }
  };

  const replaceVNode = (prevVNode: VNode, nextVNode: VNode, container: any) => {};

  const patchElement = (prevVnode: VNode, nextVNode: VNode, container: any) => {};

  const patchText = (prevVnode: VNode, nextVNode: VNode, container: any) => {};

  const patchFragment = (prevVnode: VNode, nextVNode: VNode, container: any) => {};

  const patchPortal = (prevVnode: VNode, nextVNode: VNode, container: any) => {};

  const patchComponent = (prevVnode: VNode, nextVNode: VNode, container: any) => {};

  const mount = (vnode: VNode, container: any) => {
    const { flag } = vnode;

    if (flag & VNodeFlags.ELEMENT) {
      mountElement(vnode, container);
    } else if (flag & VNodeFlags.TEXT) {
      mountText(vnode, container);
    } else if (flag & VNodeFlags.FRAGMENT) {
      mountFragment(vnode, container);
    } else if (flag & VNodeFlags.PORTAL) {
      mountPortal(vnode, container);
    } else if (flag & VNodeFlags.COMPONENT) {
      mountComponent(vnode, flag, container);
    }
  };

  const mountElement = (vnode: VNode, container: any) => {};

  const mountText = (vnode: VNode, container: any) => {};

  const mountFragment = (vnode: VNode, container: any) => {};

  const mountPortal = (vnode: VNode, container: any) => {};

  const mountComponent = (vnode: VNode, flag: any, container: any) => {
    if (flag & VNodeFlags.COMPONENT_STATEFUL_NORMAL) {
      mountStatefulComponent(vnode, container);
    } else {
      mountFunctionalComponent(vnode, container);
    }
  };

  const mountStatefulComponent = (vnode: VNode, container: any) => {};

  const mountFunctionalComponent = (vnode: VNode, container: any) => {};

  const unmount = (container: any) => {};

  const render = (vnode: VNode, container: any) => {
    const preVNode = container.vnode;
    if (preVNode == null) {
      if (vnode) {
        mount(vnode, container);
        /* Update vnode on container */
        container.vnode = vnode;
      }
    } else {
      if (vnode) {
        patch(preVNode, vnode, container);
        container.vnode = vnode;
      } else {
        unmount(container);
        container.vnode = null;
      }
    }
  };

  return render;
}
