"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteMlInferencePipeline = void 0;
var _error_codes = require("../../../../../../common/types/error_codes");
var _ml_inference_pipeline_utils = require("../../../../../utils/ml_inference_pipeline_utils");
var _detach_ml_inference_pipeline = require("./detach_ml_inference_pipeline");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const deleteMlInferencePipeline = async (indexName, pipelineName, client) => {
  // Check if the pipeline is in use in a different index's managed pipeline
  const otherPipelineName = await findUsageInOtherManagedPipelines(pipelineName, indexName, client);
  if (otherPipelineName) {
    throw Object.assign(new Error(_error_codes.ErrorCode.PIPELINE_IS_IN_USE), {
      pipelineName: otherPipelineName
    });
  }

  // Detach the pipeline first
  const response = await detachPipeline(indexName, pipelineName, client);

  // Finally, delete pipeline
  const deleteResponse = await client.ingest.deletePipeline({
    id: pipelineName
  });
  if (deleteResponse.acknowledged === true) {
    response.deleted = pipelineName;
  }
  return response;
};
exports.deleteMlInferencePipeline = deleteMlInferencePipeline;
const detachPipeline = async (indexName, pipelineName, client) => {
  try {
    return await (0, _detach_ml_inference_pipeline.detachMlInferencePipeline)(indexName, pipelineName, client);
  } catch (error) {
    var _error$meta;
    // only suppress Not Found error
    if (((_error$meta = error.meta) === null || _error$meta === void 0 ? void 0 : _error$meta.statusCode) !== 404) {
      throw error;
    }
    return {};
  }
};
const findUsageInOtherManagedPipelines = async (pipelineName, indexName, client) => {
  try {
    var _Object$entries$find;
    // Fetch all managed parent ML pipelines
    const pipelines = await client.ingest.getPipeline({
      id: '*@ml-inference'
    });

    // The given inference pipeline is being used in another index's managed pipeline if:
    // - The index name is different from the one we're deleting from, AND
    // - Its processors contain at least one entry in which the supplied pipeline name is referenced
    return (_Object$entries$find = Object.entries(pipelines).find(([name, pipeline]) => {
      var _pipeline$processors;
      return name !== (0, _ml_inference_pipeline_utils.getInferencePipelineNameFromIndexName)(indexName) && ((_pipeline$processors = pipeline.processors) === null || _pipeline$processors === void 0 ? void 0 : _pipeline$processors.find(processor => {
        var _processor$pipeline;
        return ((_processor$pipeline = processor.pipeline) === null || _processor$pipeline === void 0 ? void 0 : _processor$pipeline.name) === pipelineName;
      }));
    })) === null || _Object$entries$find === void 0 ? void 0 : _Object$entries$find[0]; // Managed pipeline name
  } catch (error) {
    var _error$meta2;
    // only suppress Not Found error
    if (((_error$meta2 = error.meta) === null || _error$meta2 === void 0 ? void 0 : _error$meta2.statusCode) !== 404) {
      throw error;
    }
  }
};