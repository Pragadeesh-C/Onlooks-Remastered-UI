// vitest.setup.ts
import '@testing-library/jest-dom/vitest'; // Extends vitest's expect with jest-dom matchers
import { vi } from 'vitest';

// Optional: Mock localStorage if jsdom's isn't working reliably
// const localStorageMock = (() => {
//   let store: { [key: string]: string } = {};
//   return {
//     getItem: (key: string) => store[key] || null,
//     setItem: (key: string, value: string) => {
//       store[key] = value.toString();
//     },
//     removeItem: (key: string) => {
//       delete store[key];
//     },
//     clear: () => {
//       store = {};
//     },
//     key: (index: number) => Object.keys(store)[index] || null,
//     get length() {
//       return Object.keys(store).length;
//     },
//   };
// })();
// Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Optional: Mock fetch if needed globally
// global.fetch = vi.fn(() =>
//   Promise.resolve({
//     json: () => Promise.resolve({}),
//     ok: true,
//     status: 200,
//   } as Response)
// );

// Add any other global setup or mocks here