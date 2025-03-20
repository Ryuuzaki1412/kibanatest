"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildEcsObjects = void 0;
var _fp = require("lodash/fp");
var _constants = require("./constants");
var _get_timestamp = require("./get_timestamp");
var _build_object_recursive = require("./build_object_recursive");
var _get_nested_parent_path = require("./get_nested_parent_path");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildEcsObjects = hit => {
  const ecsFields = [..._constants.TIMELINE_EVENTS_FIELDS];
  return ecsFields.reduce((acc, field) => {
    const nestedParentPath = (0, _get_nested_parent_path.getNestedParentPath)(field, hit.fields);
    if (nestedParentPath != null || (0, _fp.has)(field, hit.fields) || _constants.ECS_METADATA_FIELDS.includes(field)) {
      return (0, _fp.merge)(acc, (0, _build_object_recursive.buildObjectRecursive)(field, hit.fields));
    }
    return acc;
  }, {
    _id: hit._id,
    timestamp: (0, _get_timestamp.getTimestamp)(hit),
    _index: hit._index
  });
};
exports.buildEcsObjects = buildEcsObjects;