"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdHocTaskCounter = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Keeps track of how many tasks have been created.
 *
 * @export
 * @class AdHocTaskCounter
 *
 */
class AdHocTaskCounter {
  /**
   * Gets the number of created tasks.
   */
  get count() {
    return this._count;
  }
  constructor() {
    (0, _defineProperty2.default)(this, "_count", void 0);
    this._count = 0;
  }
  increment(by = 1) {
    this._count += by;
  }
  reset() {
    this._count = 0;
  }
}
exports.AdHocTaskCounter = AdHocTaskCounter;