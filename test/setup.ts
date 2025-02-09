import 'zone.js';
import 'zone.js/testing';
import { expect } from 'bun:test';
import { afterEach } from 'bun:test';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { GlobalRegistrator } from '@happy-dom/global-registrator';
import * as domMatchers from '@testing-library/jest-dom/matchers';
import extendedMatchers from 'jest-extended';

GlobalRegistrator.register();

// @ts-ignore
expect.extend(extendedMatchers);
// @ts-ignore
expect.extend(domMatchers);

getTestBed().initTestEnvironment(
  [BrowserDynamicTestingModule],
  platformBrowserDynamicTesting(),
);

afterEach(() => {
  getTestBed().resetTestingModule();
});
