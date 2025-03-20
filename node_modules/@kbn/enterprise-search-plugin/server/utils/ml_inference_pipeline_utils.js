"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPrefixedInferencePipelineProcessorName = exports.getInferencePipelineNameFromIndexName = void 0;
var _ml_inference_pipeline = require("../../common/ml_inference_pipeline");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getInferencePipelineNameFromIndexName = indexName => `${indexName}@ml-inference`;
exports.getInferencePipelineNameFromIndexName = getInferencePipelineNameFromIndexName;
const getPrefixedInferencePipelineProcessorName = pipelineName => pipelineName.startsWith('ml-inference-') ? (0, _ml_inference_pipeline.formatPipelineName)(pipelineName) : `ml-inference-${(0, _ml_inference_pipeline.formatPipelineName)(pipelineName)}`;
exports.getPrefixedInferencePipelineProcessorName = getPrefixedInferencePipelineProcessorName;