"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EmptySizeRatios = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let EmptySizeRatios;
exports.EmptySizeRatios = EmptySizeRatios;
(function (EmptySizeRatios) {
  EmptySizeRatios[EmptySizeRatios["SMALL"] = 0.3] = "SMALL";
  EmptySizeRatios[EmptySizeRatios["MEDIUM"] = 0.54] = "MEDIUM";
  EmptySizeRatios[EmptySizeRatios["LARGE"] = 0.7] = "LARGE";
})(EmptySizeRatios || (exports.EmptySizeRatios = EmptySizeRatios = {}));