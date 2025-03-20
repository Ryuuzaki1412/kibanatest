"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExpressionPartitionVisPlugin = void 0;
var _common = require("../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

class ExpressionPartitionVisPlugin {
  setup(core, {
    expressions
  }) {
    expressions.registerFunction(_common.partitionLabelsFunction);
    expressions.registerFunction(_common.pieVisFunction);
    expressions.registerFunction(_common.treemapVisFunction);
    expressions.registerFunction(_common.mosaicVisFunction);
    expressions.registerFunction(_common.waffleVisFunction);
  }
  start(core, deps) {}
  stop() {}
}
exports.ExpressionPartitionVisPlugin = ExpressionPartitionVisPlugin;