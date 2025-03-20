"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.systemHasInsufficientMemory = systemHasInsufficientMemory;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MIN_CLOUD_MEM_GB = 2;
const MIN_CLOUD_MEM_MB = MIN_CLOUD_MEM_GB * 1024;

/**
 * If we are on Cloud we need to ensure that we have sufficient memory available,
 * if we do not Chromium cannot start. See {@link MIN_CLOUD_MEM_MB}.
 *
 */
function systemHasInsufficientMemory(cloud, logger) {
  if (cloud !== null && cloud !== void 0 && cloud.isCloudEnabled && typeof (cloud === null || cloud === void 0 ? void 0 : cloud.instanceSizeMb) === 'number') {
    const instanceSizeMb = cloud.instanceSizeMb;
    logger.info(`Memory limit read from cloud (in MB): ${instanceSizeMb}`);
    return instanceSizeMb < MIN_CLOUD_MEM_MB;
  }
  return false;
}