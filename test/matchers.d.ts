import type { AsymmetricMatchers, Matchers } from 'bun:test';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
// @ts-ignore
import type CustomMatchers from 'jest-extended';

declare module 'bun:test' {
  interface Matchers<T>
    extends TestingLibraryMatchers<typeof expect.stringContaining, T>,
      CustomMatchers<T> {}
  // @ts-expect-error missing type arguments
  interface AsymmetricMatchers extends TestingLibraryMatchers, CustomMatchers {}
}
