"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHosts = exports.getHits = exports.formatUncommonProcessesData = exports.UNCOMMON_PROCESSES_FIELDS = void 0;
var _fp = require("lodash/fp");
var _fp2 = require("@kbn/safer-lodash-set/fp");
var _get_flattened_fields = require("../../../../helpers/get_flattened_fields");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const UNCOMMON_PROCESSES_FIELDS = ['_id', 'instances', 'process.args', 'process.name', 'user.id', 'user.name', 'host.name'];
exports.UNCOMMON_PROCESSES_FIELDS = UNCOMMON_PROCESSES_FIELDS;
const getHits = buckets => buckets.map(bucket => ({
  _id: bucket.process.hits.hits[0]._id,
  _index: bucket.process.hits.hits[0]._index,
  _type: bucket.process.hits.hits[0]._type,
  _score: bucket.process.hits.hits[0]._score,
  fields: bucket.process.hits.hits[0].fields,
  sort: bucket.process.hits.hits[0].sort,
  cursor: bucket.process.hits.hits[0].cursor,
  total: bucket.process.hits.total,
  host: getHosts(bucket.hosts.buckets)
}));
exports.getHits = getHits;
const getHosts = buckets => buckets.map(bucket => {
  const fields = (0, _fp.get)('host.hits.hits[0].fields', bucket);
  return {
    id: [bucket.key],
    name: (0, _fp.get)('host.name', fields)
  };
});
exports.getHosts = getHosts;
const formatUncommonProcessesData = (hit, fieldMap) => {
  let flattenedFields = {
    node: {
      _id: '',
      instances: 0,
      process: {},
      hosts: [{}]
    },
    cursor: {
      value: '',
      tiebreaker: null
    }
  };
  const instancesCount = typeof hit.total === 'number' ? hit.total : hit.total.value;
  const processFlattenedFields = (0, _get_flattened_fields.getFlattenedFields)(UNCOMMON_PROCESSES_FIELDS, hit.fields, fieldMap);
  if (Object.keys(processFlattenedFields).length > 0) {
    flattenedFields = (0, _fp2.set)('node', processFlattenedFields, flattenedFields);
  }
  flattenedFields.node._id = hit._id;
  flattenedFields.node.instances = instancesCount;
  flattenedFields.node.hosts = hit.host;
  if (hit.cursor) {
    flattenedFields.cursor.value = hit.cursor;
  }
  return flattenedFields;
};
exports.formatUncommonProcessesData = formatUncommonProcessesData;