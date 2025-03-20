"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getComponentTemplateNameForDatastream = getComponentTemplateNameForDatastream;
exports.getPipelineNameForDatastream = exports.getCustomPipelineNameForDatastream = void 0;
exports.getRegistryDataStreamAssetBaseName = getRegistryDataStreamAssetBaseName;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Creates the base name for Elasticsearch assets in the form of
 * {type}-{dataset}
 */
function getRegistryDataStreamAssetBaseName(dataStream) {
  const baseName = `${dataStream.type}-${dataStream.dataset}`;
  return dataStream.hidden ? `.${baseName}` : baseName;
}

/**
 * Return the name for a component template
 */
function getComponentTemplateNameForDatastream(dataStream, suffix) {
  return `${getRegistryDataStreamAssetBaseName(dataStream)}${suffix !== null && suffix !== void 0 ? suffix : ''}`;
}

/**
 * Return the ingest pipeline name for a datastream
 */
const getPipelineNameForDatastream = ({
  dataStream,
  packageVersion
}) => {
  return `${dataStream.type}-${dataStream.dataset}-${packageVersion}`;
};

/**
 * Return the custom user ingest pipeline name for a datastream
 */
exports.getPipelineNameForDatastream = getPipelineNameForDatastream;
const getCustomPipelineNameForDatastream = dataStream => {
  return `${dataStream.type}-${dataStream.dataset}@custom`;
};
exports.getCustomPipelineNameForDatastream = getCustomPipelineNameForDatastream;