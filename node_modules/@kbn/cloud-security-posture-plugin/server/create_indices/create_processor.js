"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPipelineIfNotExists = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * @param logger - logger
 * @param pipelineConf - ingest pipeline configuration
 * @param esClient - the elasticsearch client
 * @return true if the pipeline exits or created, false otherwise.
 */
const createPipelineIfNotExists = async (esClient, pipelineConf, logger) => {
  const pipelineId = pipelineConf.id;
  try {
    await esClient.ingest.getPipeline({
      id: pipelineId
    });
    logger.trace(`pipeline: ${pipelineId} already exists`);
    return true;
  } catch (exitErr) {
    const exitError = (0, _securitysolutionEsUtils.transformError)(exitErr);
    if (exitError.statusCode === 404) {
      try {
        await esClient.ingest.putPipeline(pipelineConf);
        logger.trace(`pipeline: ${pipelineId} was created`);
        return true;
      } catch (existError) {
        logger.error(`Failed to create CSP pipeline ${pipelineId}. error: ${existError.message}`);
        return false;
      }
    } else {
      logger.error(`Failed to check if CSP pipeline ${pipelineId} exists. error: ${exitError.message}`);
    }
  }
  return false;
};
exports.createPipelineIfNotExists = createPipelineIfNotExists;