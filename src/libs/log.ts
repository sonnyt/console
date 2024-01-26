export const TYPES = ["log", "info", "warn", "error"];
export type Type = (typeof TYPES)[number];

export default function consoleStub(
  setLog: (type: Type, ...args: any[]) => void
) {
  return new Proxy(console, {
    get(target: typeof console, prop: keyof typeof console) {
      if (TYPES.includes(prop as Type)) {
        return (...args: any[]) => {
          setLog(prop as Type, ...args);
          (target as any)[prop](...args);
        };
      }

      return target[prop];
    },
  });
}

export function promiseStub(
  scope: WeakMap<any, any>,
  originalPromise: PromiseConstructor
) {
  return function (callback: any) {
    const promise = new originalPromise(callback);
    scope.set(promise, { state: "pending", value: null });

    promise.then(
      (value) => {
        scope.set(promise, { state: "fulfilled", value: value });
      },
      (value) => {
        scope.set(promise, { state: "rejected", value: value });
      }
    );

    return promise;
  };
}

export function proxyStub(
  scope: WeakMap<any, any>,
  originalProxy: ProxyConstructor
) {
  return function <T extends object>(target: T, handler: ProxyHandler<T>) {
    const proxy = new originalProxy(target, handler);
    scope.set(proxy, { target, handler, isProxy: true });
    return proxy;
  };
}
