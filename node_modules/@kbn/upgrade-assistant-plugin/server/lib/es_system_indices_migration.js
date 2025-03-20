"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startESSystemIndicesMigration = exports.getESSystemIndicesMigrationStatus = exports.convertFeaturesToIndicesArray = void 0;
var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const convertFeaturesToIndicesArray = features => {
  return (0, _fp.flow)(
  // Map each feature into Indices[]
  (0, _fp.map)('indices'),
  // Flatten each into an string[] of indices
  (0, _fp.map)((0, _fp.flatMap)('index')),
  // Flatten the array
  _fp.flatten,
  // And finally dedupe the indices
  _fp.uniq)(features);
};
exports.convertFeaturesToIndicesArray = convertFeaturesToIndicesArray;
const getESSystemIndicesMigrationStatus = async client => {
  const body = await client.transport.request({
    method: 'GET',
    path: '/_migration/system_features'
  });
  return body;
};
exports.getESSystemIndicesMigrationStatus = getESSystemIndicesMigrationStatus;
const startESSystemIndicesMigration = async client => {
  const body = await client.transport.request({
    method: 'POST',
    path: '/_migration/system_features'
  });
  return body;
};
exports.startESSystemIndicesMigration = startESSystemIndicesMigration;