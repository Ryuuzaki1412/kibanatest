"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertESResponseToTopNodesResponse = void 0;
var _get_matadata_from_node_bucket = require("./get_matadata_from_node_bucket");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const convertESResponseToTopNodesResponse = response => {
  if (!response.aggregations) {
    return {
      series: []
    };
  }
  return {
    series: response.aggregations.nodes.buckets.map(node => {
      var _node$rx, _node$tx;
      return {
        id: node.key,
        ...(0, _get_matadata_from_node_bucket.getMetadataFromNodeBucket)(node),
        timeseries: node.timeseries.buckets.map(bucket => {
          var _bucket$rx, _bucket$tx;
          return {
            timestamp: bucket.key,
            cpu: bucket.cpu.value,
            iowait: bucket.iowait.value,
            load: bucket.load.value,
            rx: ((_bucket$rx = bucket.rx) === null || _bucket$rx === void 0 ? void 0 : _bucket$rx.bytes.value) || null,
            tx: ((_bucket$tx = bucket.tx) === null || _bucket$tx === void 0 ? void 0 : _bucket$tx.bytes.value) || null
          };
        }),
        cpu: node.cpu.value,
        iowait: node.iowait.value,
        load: node.load.value,
        uptime: node.uptime.value,
        rx: ((_node$rx = node.rx) === null || _node$rx === void 0 ? void 0 : _node$rx.bytes.value) || null,
        tx: ((_node$tx = node.tx) === null || _node$tx === void 0 ? void 0 : _node$tx.bytes.value) || null
      };
    })
  };
};
exports.convertESResponseToTopNodesResponse = convertESResponseToTopNodesResponse;