"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.detachMlInferencePipeline = void 0;
var _ml_inference_pipeline_utils = require("../../../../../utils/ml_inference_pipeline_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const detachMlInferencePipeline = async (indexName, pipelineName, client) => {
  const response = {};
  const parentPipelineId = (0, _ml_inference_pipeline_utils.getInferencePipelineNameFromIndexName)(indexName);

  // find parent pipeline
  const pipelineResponse = await client.ingest.getPipeline({
    id: parentPipelineId
  });
  const parentPipeline = pipelineResponse[parentPipelineId];
  if (parentPipeline !== undefined) {
    // remove sub-pipeline from parent pipeline
    if (parentPipeline.processors !== undefined) {
      const updatedProcessors = parentPipeline.processors.filter(p => !(p.pipeline !== undefined && p.pipeline.name === pipelineName));
      // only update if we changed something
      if (updatedProcessors.length !== parentPipeline.processors.length) {
        const updatedPipeline = {
          ...parentPipeline,
          id: parentPipelineId,
          processors: updatedProcessors
        };
        const updateResponse = await client.ingest.putPipeline(updatedPipeline);
        if (updateResponse.acknowledged === true) {
          response.updated = parentPipelineId;
        }
      }
    }
  }
  return response;
};
exports.detachMlInferencePipeline = detachMlInferencePipeline;