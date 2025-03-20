"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AverageDuration = void 0;
var _constants = require("../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class AverageDuration {
  build() {
    return {
      mttr: {
        avg: {
          field: `${_constants.CASE_SAVED_OBJECT}.attributes.duration`
        }
      }
    };
  }
  formatResponse(aggregations) {
    var _aggs$mttr$value, _aggs$mttr;
    const aggs = aggregations;
    const mttr = (_aggs$mttr$value = aggs === null || aggs === void 0 ? void 0 : (_aggs$mttr = aggs.mttr) === null || _aggs$mttr === void 0 ? void 0 : _aggs$mttr.value) !== null && _aggs$mttr$value !== void 0 ? _aggs$mttr$value : null;
    return {
      mttr
    };
  }
  getName() {
    return 'mttr';
  }
}
exports.AverageDuration = AverageDuration;