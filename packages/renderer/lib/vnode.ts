import { keys } from './utils';

export interface VNode {
  sel: string | undefined;
  flag: VNodeFlags;
  childFlag: ChildFlags;
  elm: Node | null /* Reference of real node */;
  data: VNodeData | undefined;
  children: Array<VNode | string> | VNode | string | undefined /* Reuse properties for text node */;
}

export interface VNodeData {
  class?: any;
  style?: any;
  props?: any;
  [eventName: string]: any;
}

export enum VNodeFlags {
  /* Normal Element */
  ELEMENT_HTML = 1,
  ELEMENT_SVG = 1 << 1,
  TEXT = 1 << 2,
  FRAGMENT = 1 << 3,
  PORTAL = 1 << 4,

  /* Component */
  COMPONENT_FUNCTIONAL = 1 << 5,
  COMPONENT_STATEFUL_NORMAL = 1 << 6,
  COMPONENT_STATEFUL_NEED_KEEP_ALIVE = 1 << 7,
  COMPONENT_STATEFUL_KEPT_ALIVE = 1 << 8,

  /* Union */
  ELEMENT = ELEMENT_HTML | ELEMENT_SVG,
  COMPONENT = COMPONENT_FUNCTIONAL |
    COMPONENT_STATEFUL_NORMAL |
    COMPONENT_STATEFUL_NEED_KEEP_ALIVE |
    COMPONENT_STATEFUL_KEPT_ALIVE,
}

export enum ChildFlags {
  NO_CHILD = 1,
  SINGLE_CHILD = 1 << 1,
  MULTI_CHILDREN = 1 << 2,
}

export const Fragment = Symbol();
export const Portal = Symbol();

export function vnode(
  sel: string | undefined,
  flag: VNodeFlags,
  elm: any | undefined,
  data: any | undefined,
  children: Array<VNode | string> | undefined,
  childFlag?: ChildFlags,
): VNode {
  if (keys(data).length === 0) data = undefined;
  if (!childFlag) childFlag = ChildFlags.NO_CHILD;
  return { sel, flag, childFlag, elm, data, children };
}
