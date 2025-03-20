"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createIngestPipeline = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createIngestPipeline = async ({
  esClient,
  logger,
  options
}) => {
  const processors = typeof options.processors === 'string' ? JSON.parse(options.processors) : options.processors;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const {
    name,
    description,
    version,
    on_failure
  } = options;
  try {
    await esClient.ingest.putPipeline({
      id: name,
      body: {
        description,
        processors,
        version,
        on_failure
      }
    });
    return {
      [name]: {
        success: true,
        error: null
      }
    };
  } catch (err) {
    const error = (0, _securitysolutionEsUtils.transformError)(err);
    logger.error(`Failed to create ingest pipeline: ${name}: ${error.message}`);
    return {
      [name]: {
        success: false,
        error
      }
    };
  }
};
exports.createIngestPipeline = createIngestPipeline;