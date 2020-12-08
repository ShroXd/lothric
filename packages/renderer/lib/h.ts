import { isArray, isString } from './utils';
import { ChildFlags, Fragment, Portal, vnode, VNode, VNodeData, VNodeFlags } from './vnode';

export function h(sel: string | symbol): VNode;
export function h(sel: string | symbol, data: VNodeData | undefined): VNode;
export function h(sel: string | symbol, children: any): VNode;
export function h(sel: string | symbol, data: VNodeData | undefined, children: any): VNode;
export function h(sel: any, a?: any, b?: any): VNode {
  let data: VNodeData = {};
  let children: any;
  const flag = parseFlag(sel);
  let childFlag = ChildFlags.NO_CHILD;
  if (!!b) {
    if (!!a) {
      data = a;
      childFlag = ChildFlags.SINGLE_CHILD;
    }
    if ((b && b.sel) || isString(b)) {
      children = b;
      childFlag = ChildFlags.SINGLE_CHILD;
    } else if (isArray(b)) {
      children = b;
      childFlag = ChildFlags.MULTI_CHILDREN;
    }
  } else if (!!a) {
    if ((a && a.sel) || isString(a)) {
      children = a;
      childFlag = ChildFlags.SINGLE_CHILD;
    } else if (isArray(a)) {
      children = a;
      childFlag = ChildFlags.MULTI_CHILDREN;
    } else {
      data = a;
    }
  }
  if (!!children) {
    // TODO parse children
  }
  // TODO parse SVG
  return vnode(sel, flag, undefined, data, children, childFlag);
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
