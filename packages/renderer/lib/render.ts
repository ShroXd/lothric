import { getRenderPreset, RenderOptions } from './render-options';
import { isString, keys } from './utils';
import { ChildFlags, VNode, VNodeFlags } from './vnode';

export function renderer() {
  const options = getRenderPreset();
  return createRenderer(options);
}

function createRenderer(options: RenderOptions): any {
  const {
    // tagName,
    // setTextContent,
    // getTextContent,
    // isElement,
    // isText,
    // isComment,
    // parentNode,
    // nextSibling,
    removeChild,
    createElement,
    createTextNode,
    // createComment,
    domProp,
  } = options;

  const patch = (prevVNode: VNode, nextVNode: VNode, container: Element) => {
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

  const replaceVNode = (prevVNode: VNode, nextVNode: VNode, container: any) => {
    removeChild(prevVNode, container);
    mount(nextVNode, container);
  };

  const patchElement = (prevVnode: VNode, nextVNode: VNode, container: any) => {
    /* replace vnode for different tag node */
    if (prevVnode.sel !== nextVNode.sel) {
      replaceVNode(prevVnode, nextVNode, container);
      return;
    }

    /* patch vnode data */
    const elm = (nextVNode.elm = prevVnode.elm);
    const prevData = prevVnode.data;
    const nextData = nextVNode.data;
    if (nextData) {
      keys(nextData).forEach((key) => {
        const prevValue = prevData?.[key];
        const nextValue = nextData?.[key];
        patchVNodeData(elm, key, prevValue, nextValue);
      });
    }

    /* patch vnode children */
    patchChildren(prevVnode, nextVNode, container);
  };

  const patchVNodeData = (elm: any, key: any, prevValue: any, nextValue: any) => {
    switch (key) {
      case 'class':
        elm.className = nextValue;
        break;
      case 'style':
        /* Apple new style */
        for (let k in nextValue) {
          (elm as HTMLElement).style[k] = nextValue[k];
        }
        /* Delete defference set of old style & new style  */
        if (!!prevValue) break;
        for (let k in prevValue) {
          if (!nextValue.hasOwnProperty(k)) {
            (elm as HTMLElement).style[k] = '';
          }
        }
        break;
      default:
        if (key[0] === 'o' && key[1] === 'n') {
          if (prevValue) {
            elm.removeEventListener(key.slice(2).toLocaleLowerCase(), prevValue);
          }
          if (nextValue) {
            elm.addEventListener(key.slice(2).toLocaleLowerCase(), nextValue);
          }
        } else if (domProp.test(key)) {
          elm[key] = nextValue[key];
        } else {
          elm.setAttribute(key, nextValue);
        }
        break;
    }
  };

  const patchChildren = (prevVNode: VNode, nextVNode: VNode, container: any) => {
    const { children: prevChildren, childFlag: prevChildFlag } = prevVNode;
    const { children: nextChildren, childFlag: nextChildFlag } = nextVNode;

    switch (prevChildFlag) {
      case ChildFlags.NO_CHILD:
        switch (nextChildFlag) {
          case ChildFlags.NO_CHILD:
            /* Nothing */
            break;
          case ChildFlags.SINGLE_CHILD:
            mount(nextChildren as VNode, container);
            break;
          case ChildFlags.MULTI_CHILDREN:
            (nextChildren as Array<VNode | string>).forEach((child) => {
              mount(child as VNode, container);
            });
            break;
        }
        break;
      case ChildFlags.SINGLE_CHILD:
        switch (nextChildFlag) {
          case ChildFlags.NO_CHILD:
            unmount(prevChildren as VNode, container);
            break;
          case ChildFlags.SINGLE_CHILD:
            /* TODO should I fix this fucking type? */
            patch(prevChildren as VNode, nextChildren as VNode, container);
            break;
          case ChildFlags.MULTI_CHILDREN:
            unmount(prevChildren as VNode, container);
            (nextChildren as Array<VNode | string>).forEach((child) => {
              mount(child as VNode, container);
            });
            break;
        }
        break;
      case ChildFlags.MULTI_CHILDREN:
        switch (nextChildFlag) {
          case ChildFlags.NO_CHILD:
            (prevChildren as Array<VNode | string>).forEach((child) => {
              unmount(child as VNode, container);
            });
            break;
          case ChildFlags.SINGLE_CHILD:
            (prevChildren as Array<VNode | string>).forEach((child) => {
              unmount(child as VNode, container);
            });
            mount(nextChildren as VNode, container);
            break;
          case ChildFlags.MULTI_CHILDREN:
            // TODO diff
            break;
        }
        break;
    }
  };

  const patchText = (prevVnode: VNode, nextVNode: VNode, container: any) => {
    const elm = (nextVNode.elm = prevVnode.elm);
    if (elm && nextVNode.children !== prevVnode.children) {
      elm.nodeValue = nextVNode.children as string;
    }
  };

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

  const mountElement = (vnode: VNode, container: Element) => {
    const elm = createElement(vnode.sel);
    vnode.elm = elm;
    container.appendChild(elm);

    /* handle data */
    const data = vnode.data;
    if (data) {
      keys(data).forEach((key) => {
        patchVNodeData(elm, key, undefined, data?.[key]);
      });
    }

    /* handle children nodes */
    const { children, childFlag } = vnode;
    switch (childFlag) {
      case ChildFlags.NO_CHILD:
        container.appendChild(elm);
        return;
      case ChildFlags.SINGLE_CHILD:
        if (isString((children as VNode)?.children)) {
          mountText(children as VNode, elm);
        } else {
          mount(children as VNode, container);
        }
        break;
      case ChildFlags.MULTI_CHILDREN:
        (children as Array<VNode | string>).forEach((child) => {
          mount(child as VNode, container);
        });
        break;
    }
  };

  const mountText = (vnode: VNode, container: any) => {
    const elm = createTextNode(vnode.children as string);
    vnode.elm = elm;
    container.appendChild(elm);
  };

  const mountFragment = (vnode: VNode, container: any) => {
    return mountChildren(vnode, container);
  };

  const mountPortal = (vnode: VNode, container: any) => {
    const { data } = vnode;
    const target = document.querySelector(data?.target) || container;
    mountChildren(vnode, target);

    const placeholder = createTextNode('');
    container.appendChild(placeholder);
    vnode.elm = placeholder;
  };

  const mountChildren = (vnode: VNode, container: any) => {
    const { children, childFlag } = vnode;

    switch (childFlag) {
      case ChildFlags.NO_CHILD:
        // TODO Should I insert a placehold text node here?
        break;
      case ChildFlags.SINGLE_CHILD:
        mount(children as VNode, container);
        break;
      case ChildFlags.MULTI_CHILDREN:
        (children as Array<VNode | string>).forEach((child) => {
          mount(child as VNode, container);
        });
        break;
    }
  };

  const mountComponent = (vnode: VNode, flag: any, container: any) => {
    if (flag & VNodeFlags.COMPONENT_STATEFUL_NORMAL) {
      mountStatefulComponent(vnode, container);
    } else {
      mountFunctionalComponent(vnode, container);
    }
  };

  const mountStatefulComponent = (vnode: VNode, container: any) => {};

  const mountFunctionalComponent = (vnode: VNode, container: any) => {};

  const unmount = (vnode: VNode, container: any) => {
    removeChild(vnode, container);
    container.vnode = null;
  };

  const render = (vnode: VNode, container: any) => {
    const prevVNode = container.vnode;
    if (prevVNode == null) {
      if (vnode) {
        mount(vnode, container);
        /* Update vnode on container */
        container.vnode = vnode;
      }
    } else {
      if (vnode) {
        patch(prevVNode, vnode, container);
        container.vnode = vnode;
      } else {
        unmount(prevVNode, container);
        container.vnode = null;
      }
    }
  };

  return render;
}
