"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nodeBuilder = void 0;
var _types = require("../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const nodeBuilder = {
  is: (fieldName, value) => {
    return _types.nodeTypes.function.buildNodeWithArgumentNodes('is', [_types.nodeTypes.literal.buildNode(fieldName), typeof value === 'string' ? _types.nodeTypes.literal.buildNode(value) : value]);
  },
  or: nodes => {
    return nodes.length === 1 ? nodes[0] : _types.nodeTypes.function.buildNode('or', nodes);
  },
  and: nodes => {
    return nodes.length === 1 ? nodes[0] : _types.nodeTypes.function.buildNode('and', nodes);
  },
  range: (fieldName, operator, value) => {
    return _types.nodeTypes.function.buildNodeWithArgumentNodes('range', [_types.nodeTypes.literal.buildNode(fieldName), operator, typeof value === 'string' ? _types.nodeTypes.literal.buildNode(value) : value]);
  }
};
exports.nodeBuilder = nodeBuilder;