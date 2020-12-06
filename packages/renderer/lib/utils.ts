const { keys } = Object;

export { keys };

export const isArray = Array.isArray;
export const isString = (val: unknown): val is string => typeof val === 'string';
