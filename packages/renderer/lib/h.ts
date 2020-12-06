import { isArray, isString } from './utils';
import { Fragment, Portal, vnode, VNode, VNodeData, VNodeFlags } from './vnode';

export function h(sel: string | symbol): VNode;
export function h(sel: string | symbol, data: VNodeData | undefined): VNode;
export function h(sel: string | symbol, children: any): VNode;
export function h(sel: string | symbol, data: VNodeData | undefined, children: any): VNode;
export function h(sel: any, a?: any, b?: any): VNode {
  let data: VNodeData = {};
  let children: any;
  const flag = parseFlag(sel);
  if (!!b) {
    if (b && b.sel) {
      children = [b];
    } else if (isArray(b) || isString(b)) {
      children = b;
    }
    if (!!a) {
      data = a;
    }
  } else if (!!a) {
    if (a && a.sel) {
      children = [a];
    } else if (isArray(a) || isString(a)) {
      children = a;
    } else {
      data = a;
    }
  }
  if (!!children) {
    // TODO parse children
  }
  // TODO parse SVG
  return vnode(sel, flag, undefined, data, children);
}

function parseFlag(sel: string | symbol): any {
  let flag = null;

  if (typeof sel === 'string') {
    flag = sel === 'svg' ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML;
  } else if (sel === Fragment) {
    flag = VNodeFlags.FRAGMENT;
  } else if (sel === Portal) {
    flag = VNodeFlags.PORTAL;
  } else {
    /* Component */
    // TODO parse component
  }

  return flag;
}
