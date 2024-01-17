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
