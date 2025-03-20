"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addSubPipelineToIndexSpecificMlPipeline = void 0;
var _ml_inference_pipeline_utils = require("./ml_inference_pipeline_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Adds the supplied a Machine Learning Inference pipeline reference to the "parent" ML Inference
 * pipeline that is associated with the index.
 * @param indexName name of the index this pipeline corresponds to.
 * @param pipelineName name of the ML Inference pipeline to add.
 * @param esClient the Elasticsearch Client to use when retrieving pipeline details.
 */
const addSubPipelineToIndexSpecificMlPipeline = async (indexName, pipelineName, esClient) => {
  var _parentPipeline;
  const parentPipelineId = (0, _ml_inference_pipeline_utils.getInferencePipelineNameFromIndexName)(indexName);

  // Fetch the parent pipeline
  let parentPipeline;
  try {
    const pipelineResponse = await esClient.ingest.getPipeline({
      id: parentPipelineId
    });
    parentPipeline = pipelineResponse[parentPipelineId];
  } catch (error) {
    // Swallow error; in this case the next step will return
  }

  // Verify the parent pipeline exists with a processors array
  if (!((_parentPipeline = parentPipeline) !== null && _parentPipeline !== void 0 && _parentPipeline.processors)) {
    return Promise.resolve({
      addedToParentPipeline: false,
      id: pipelineName
    });
  }

  // Check if the sub-pipeline reference is already in the list of processors,
  // if so, don't modify it
  const existingSubPipeline = parentPipeline.processors.find(p => {
    var _p$pipeline;
    return ((_p$pipeline = p.pipeline) === null || _p$pipeline === void 0 ? void 0 : _p$pipeline.name) === pipelineName;
  });
  if (existingSubPipeline) {
    return Promise.resolve({
      addedToParentPipeline: false,
      id: pipelineName
    });
  }

  // Add sub-processor to the ML inference parent pipeline
  parentPipeline.processors.push({
    pipeline: {
      name: pipelineName
    }
  });
  await esClient.ingest.putPipeline({
    id: parentPipelineId,
    ...parentPipeline
  });
  return Promise.resolve({
    addedToParentPipeline: true,
    id: pipelineName
  });
};
exports.addSubPipelineToIndexSpecificMlPipeline = addSubPipelineToIndexSpecificMlPipeline;