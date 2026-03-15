import "@testing-library/jest-dom"
import * as matchers from "@testing-library/jest-dom/matchers"
import { expect } from "@jest/globals"

if (matchers) {
  // @ts-ignore
  expect.extend(matchers)
}
