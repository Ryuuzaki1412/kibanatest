"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKibanaClusterStatus = void 0;
var _get_kibanas_for_clusters = require("../../../../lib/kibana/get_kibanas_for_clusters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getKibanaClusterStatus = (req, {
  clusterUuid
}) => {
  const clusters = [{
    cluster_uuid: clusterUuid
  }];
  return (0, _get_kibanas_for_clusters.getKibanasForClusters)(req, clusters).then(kibanas => {
    var _kibanas$;
    return kibanas === null || kibanas === void 0 ? void 0 : (_kibanas$ = kibanas[0]) === null || _kibanas$ === void 0 ? void 0 : _kibanas$.stats;
  });
};
exports.getKibanaClusterStatus = getKibanaClusterStatus;