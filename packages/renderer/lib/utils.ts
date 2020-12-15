import { VNode } from './vnode';

const { keys, assign: extend } = Object;

export { keys, extend };

export const isArray = Array.isArray;
export const isString = (val: unknown): val is string => typeof val === 'string';
export const isUndefined = (obj: any): obj is undefined => typeof obj === 'undefined';
export const isSameVNodeKey = (n1: VNode, n2: VNode): boolean => n1.key === n2.key;

/* https://en.wikipedia.org/wiki/Longest_increasing_subsequence */
export const lis = (arr: any) => {
  const p = arr.slice();
  const result = [0];
  let i;
  let j;
  let u;
  let v;
  let c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = ((u + v) / 2) | 0;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }
  return result;
};
