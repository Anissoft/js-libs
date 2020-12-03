export function xc<T1>(arg: T1 | (() => T1)): T1 {
  if (typeof arg === "function") {
    return (arg as () => T1)();
  }
  return arg;
}
