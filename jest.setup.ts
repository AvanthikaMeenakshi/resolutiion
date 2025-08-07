import { mockAnimationsApi } from "jsdom-testing-mocks";
import "@testing-library/jest-dom";

mockAnimationsApi();

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;
