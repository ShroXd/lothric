export interface VNode {
  tag: string | undefined;
  flag: any;
  elm: any | undefined /* Reference of real node */;
  data: VNodeData | undefined;
  children: Array<VNode | string> | undefined /* Reuse properties */;
}

export interface VNodeData {
  class?: any;
  style?: any;
  on?: any;
  props?: any;
}

export enum VNodeFlags {
  /* Normal Element */
  ELEMENT_HTML = 1,
  ELEMENT_SVG = 1 << 1,
  TEXT = 1 << 2,
  FRAGMENT = 1 << 3,
  PORTAL = 1 << 4,

  /* Component */
  COMPONENT_STATEFUL_NORMAL = 1 << 5,
  COMPONENT_STATEFUL_NEED_KEEP_ALIVE = 1 << 6,
  COMPONENT_STATEFUL_KEPT_ALIVE = 1 << 7,
  COMPONENT_FUNCTIONAL = 1 << 8,
}
