"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startTransformIfNotStarted = exports.initializeTransforms = exports.initializeTransform = exports.createTransformIfNotExists = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _action_responses_transform = require("./action_responses_transform");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// TODO: Move transforms to integration package
const initializeTransforms = async (esClient, logger) => {
  await Promise.all([initializeTransform(esClient, _action_responses_transform.actionResponsesTransform, logger)]);
};
exports.initializeTransforms = initializeTransforms;
const initializeTransform = async (esClient, transform, logger) => createTransformIfNotExists(esClient, transform, logger).then(succeeded => {
  if (succeeded) {
    startTransformIfNotStarted(esClient, transform.transform_id, logger);
  }
});

/**
 * Checks if a transform exists, And if not creates it
 *
 * @param transform - the transform to create. If a transform with the same transform_id already exists, nothing is created or updated.
 *
 * @return true if the transform exits or created, false otherwise.
 */
exports.initializeTransform = initializeTransform;
const createTransformIfNotExists = async (esClient, transform, logger) => {
  try {
    await esClient.transform.getTransform({
      transform_id: transform.transform_id
    });
    return true;
  } catch (existErr) {
    const existError = (0, _securitysolutionEsUtils.transformError)(existErr);
    if (existError.statusCode === 404) {
      try {
        await esClient.transform.putTransform(transform);
        return true;
      } catch (createErr) {
        const createError = (0, _securitysolutionEsUtils.transformError)(createErr);
        logger.error(`Failed to create transform ${transform.transform_id}: ${createError.message}`);
      }
    } else {
      logger.error(`Failed to check if transform ${transform.transform_id} exists: ${existError.message}`);
    }
  }
  return false;
};
exports.createTransformIfNotExists = createTransformIfNotExists;
const startTransformIfNotStarted = async (esClient, transformId, logger) => {
  try {
    const transformStats = await esClient.transform.getTransformStats({
      transform_id: transformId
    });
    if (transformStats.count <= 0) {
      logger.error(`Failed starting transform ${transformId}: couldn't find transform`);
      return;
    }
    const fetchedTransformStats = transformStats.transforms[0];
    if (fetchedTransformStats.state === 'stopped') {
      try {
        return await esClient.transform.startTransform({
          transform_id: transformId
        });
      } catch (startErr) {
        const startError = (0, _securitysolutionEsUtils.transformError)(startErr);
        logger.error(`Failed starting transform ${transformId}: ${startError.message}`);
      }
    } else if (fetchedTransformStats.state === 'stopping' || fetchedTransformStats.state === 'aborting' || fetchedTransformStats.state === 'failed') {
      logger.error(`Not starting transform ${transformId} since it's state is: ${fetchedTransformStats.state}`);
    }
  } catch (statsErr) {
    const statsError = (0, _securitysolutionEsUtils.transformError)(statsErr);
    logger.error(`Failed to check if transform ${transformId} is started: ${statsError.message}`);
  }
};
exports.startTransformIfNotStarted = startTransformIfNotStarted;