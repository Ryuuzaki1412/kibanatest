"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createClusterDataCheck = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createClusterDataCheck = () => {
  let clusterHasUserData = false;
  return async function doesClusterHaveUserData(esClient, log) {
    if (!clusterHasUserData) {
      try {
        const {
          indices = {}
        } = await esClient.indices.stats({
          filter_path: 'indices.*.total.docs.count'
        });
        const indexIds = Object.keys(indices);
        clusterHasUserData = indexIds.some(indexId => {
          var _indices$indexId$tota, _indices$indexId$tota2;
          // Check index to see if it starts with known internal prefixes
          const isInternalIndex = indexId.startsWith('.') || indexId.startsWith('kibana_sample_');

          // Check index to see if it has any docs
          const hasDocs = (((_indices$indexId$tota = indices[indexId].total) === null || _indices$indexId$tota === void 0 ? void 0 : (_indices$indexId$tota2 = _indices$indexId$tota.docs) === null || _indices$indexId$tota2 === void 0 ? void 0 : _indices$indexId$tota2.count) || 0) > 0;
          return !isInternalIndex && hasDocs;
        });
      } catch (e) {
        log.warn(`Error encountered while checking cluster for user data: ${e}`);
        clusterHasUserData = false;
      }
    }
    return clusterHasUserData;
  };
};
exports.createClusterDataCheck = createClusterDataCheck;