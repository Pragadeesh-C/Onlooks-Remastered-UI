import { beforeAll } from "bun:test";

beforeAll(() => {
  // Create a minimal browser-like environment
  globalThis.document = {
    createElement: () => ({
      style: {},
      setAttribute: () => {},
      appendChild: () => {},
    }),
    createTextNode: () => ({}),
    querySelector: () => ({}),
    querySelectorAll: () => [],
    body: {
      appendChild: () => {},
      removeChild: () => {},
      contains: () => true,
    },
  };

  globalThis.window = {
    getComputedStyle: () => ({
      getPropertyValue: () => "",
    }),
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    },
  };

  globalThis.localStorage = globalThis.window.localStorage;
  globalThis.getComputedStyle = globalThis.window.getComputedStyle;
}); 