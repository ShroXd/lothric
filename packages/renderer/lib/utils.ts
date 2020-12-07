const { keys, assign: extend } = Object;

export { keys, extend };

export const isArray = Array.isArray;
export const isString = (val: unknown): val is string => typeof val === 'string';
