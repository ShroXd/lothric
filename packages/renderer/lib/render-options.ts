import { domapi, DOMAPI } from './domapi';
import { extend } from './utils';

export interface RenderOptions extends DOMAPI {
  domProp: RegExp;
}

export function getRenderPreset(api?: DOMAPI): RenderOptions {
  const options = extend({}, api !== undefined ? api : domapi, {
    domProp: /\[A-Z]|^(?:value|checked|selected|muted)$/,
  });
  return options;
}
