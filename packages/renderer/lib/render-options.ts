import { domapi, DOMAPI } from './domapi';

// TODO 添加工具方法，参考 transform 注入
export function getRenderPreset(api?: DOMAPI) {
  return api !== undefined ? api : domapi;
}
