"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attachMlInferencePipeline = void 0;
var _create_ml_inference_pipeline = require("../../../../../utils/create_ml_inference_pipeline");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const attachMlInferencePipeline = async (indexName, pipelineName, esClient) => {
  const response = await (0, _create_ml_inference_pipeline.addSubPipelineToIndexSpecificMlPipeline)(indexName, pipelineName, esClient);
  return response;
};
exports.attachMlInferencePipeline = attachMlInferencePipeline;