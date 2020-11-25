export type AccessObserver = (target: any, key?: any) => void;
export type MutationObserver = (target: any, key?: any) => void;
export type DistortionHandler = (value: any) => void;
export type IsValueObservable = (value: any) => boolean;

export interface ReactivityOptions {
  accessObserver?: AccessObserver;
  mutationObserver?: MutationObserver;
  distortionHandler?: DistortionHandler;
  isValueObservable?: IsValueObservable;
}

export const defaultAccessObserver: AccessObserver = (target: any, key?: any) => {
  // do nothing
};
export const defaultMutationObserver: MutationObserver = (target: any, key?: any) => {
  // do nothing
};
export const defaultDistortionHandler: DistortionHandler = (value: any) => value;
export const defaultIsValueObservable: IsValueObservable = (value: any) =>
  !(value === null || typeof value !== 'object');
