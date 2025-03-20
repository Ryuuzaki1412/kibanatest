"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProgressiveLoadingQuality = void 0;
exports.getProbabilityFromProgressiveLoadingQuality = getProbabilityFromProgressiveLoadingQuality;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let ProgressiveLoadingQuality;
exports.ProgressiveLoadingQuality = ProgressiveLoadingQuality;
(function (ProgressiveLoadingQuality) {
  ProgressiveLoadingQuality["low"] = "low";
  ProgressiveLoadingQuality["medium"] = "medium";
  ProgressiveLoadingQuality["high"] = "high";
  ProgressiveLoadingQuality["off"] = "off";
})(ProgressiveLoadingQuality || (exports.ProgressiveLoadingQuality = ProgressiveLoadingQuality = {}));
function getProbabilityFromProgressiveLoadingQuality(quality) {
  switch (quality) {
    case ProgressiveLoadingQuality.high:
      return 0.1;
    case ProgressiveLoadingQuality.medium:
      return 0.01;
    case ProgressiveLoadingQuality.low:
      return 0.001;
    case ProgressiveLoadingQuality.off:
      return 1;
  }
}