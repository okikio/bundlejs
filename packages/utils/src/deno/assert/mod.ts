// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.

/** A library of assertion functions.
 * If the assertion is false an `AssertionError` will be thrown which will
 * result in pretty-printed diff of failing assertion.
 *
 * This module is browser compatible, but do not rely on good formatting of
 * values for AssertionError messages in browsers.
 *
 * @module
 */

export * from "./assert.ts";
export * from "./assertion_error.ts";
