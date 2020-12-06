import { keys } from './utils';

export interface VNode {
  sel: string | undefined;
  flag: any;
  elm: any | undefined /* Reference of real node */;
  data: VNodeData | undefined;
  children: Array<VNode | string> | undefined /* Reuse properties */;
}

export interface VNodeData {
  class?: any;
  style?: any;
  props?: any;
  on?: any;
}

export enum VNodeFlags {
  /* Normal Element */
  ELEMENT_HTML = 1,
  ELEMENT_SVG = 1 << 1,
  TEXT = 1 << 2,
  FRAGMENT = 1 << 3,
  PORTAL = 1 << 4,

  /* Component */
  COMPONENT_FUNCTIONAL = 1 << 8,
  COMPONENT_STATEFUL_NORMAL = 1 << 5,
  COMPONENT_STATEFUL_NEED_KEEP_ALIVE = 1 << 6,
  COMPONENT_STATEFUL_KEPT_ALIVE = 1 << 7,

  /* Union */
  ELEMENT = ELEMENT_HTML | ELEMENT_SVG,
  COMPONENT = COMPONENT_FUNCTIONAL |
    COMPONENT_STATEFUL_NORMAL |
    COMPONENT_STATEFUL_NEED_KEEP_ALIVE |
    COMPONENT_STATEFUL_KEPT_ALIVE,
}

export const Fragment = Symbol();
export const Portal = Symbol();

export function vnode(
  sel: string | undefined,
  flag: any,
  elm: any | undefined,
  data: any | undefined,
  children: Array<VNode | string> | undefined,
): VNode {
  if (keys(data).length === 0) data = undefined;
  return { sel, flag, elm, data, children };
}
