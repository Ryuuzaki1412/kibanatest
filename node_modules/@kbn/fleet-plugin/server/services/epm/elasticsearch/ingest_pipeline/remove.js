"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deletePipeline = deletePipeline;
exports.deletePreviousPipelines = void 0;
var _ = require("../../..");
var _types = require("../../../../types");
var _errors = require("../../../../errors");
var _install = require("../../packages/install");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const deletePreviousPipelines = async (esClient, savedObjectsClient, pkgName, previousPkgVersion, esReferences) => {
  const logger = _.appContextService.getLogger();
  const installedPipelines = esReferences.filter(({
    type,
    id
  }) => type === _types.ElasticsearchAssetType.ingestPipeline && id.includes(previousPkgVersion));
  try {
    await Promise.all(installedPipelines.map(({
      type,
      id
    }) => {
      return deletePipeline(esClient, id);
    }));
  } catch (e) {
    logger.error(e);
  }
  return await (0, _install.updateEsAssetReferences)(savedObjectsClient, pkgName, esReferences, {
    assetsToRemove: esReferences.filter(({
      type,
      id
    }) => {
      return type === _types.ElasticsearchAssetType.ingestPipeline && id.includes(previousPkgVersion);
    })
  });
};
exports.deletePreviousPipelines = deletePreviousPipelines;
async function deletePipeline(esClient, id) {
  // '*' shouldn't ever appear here, but it still would delete all ingest pipelines
  if (id && id !== '*') {
    try {
      await esClient.ingest.deletePipeline({
        id
      });
    } catch (err) {
      // Only throw if error is not a 404 error. Sometimes the pipeline is already deleted, but we have
      // duplicate references to them, see https://github.com/elastic/kibana/issues/91192
      if (err.statusCode !== 404) {
        throw new _errors.FleetError(`error deleting pipeline ${id}: ${err}`);
      }
    }
  }
}