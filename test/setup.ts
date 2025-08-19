/// <reference types="vitest/globals" />
import "@testing-library/jest-dom";

// Silence Next.js server action warnings in tests
// and any noisy console during rendering
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    const msg = String(args[0] || "");
    if (
      msg.includes("Warning: useLayoutEffect does nothing on the server") ||
      msg.includes("A component was suspended while responding to synchronous input")
    ) {
      return;
    }
    originalError(...args);
  };
});

afterAll(() => {
  console.error = originalError;
});


