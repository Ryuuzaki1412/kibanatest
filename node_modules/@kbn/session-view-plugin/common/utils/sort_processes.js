"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortProcesses = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const sortProcesses = (a, b) => {
  var _a$getDetails, _a$getDetails$process, _b$getDetails, _b$getDetails$process;
  const eventAStartTime = ((_a$getDetails = a.getDetails()) === null || _a$getDetails === void 0 ? void 0 : (_a$getDetails$process = _a$getDetails.process) === null || _a$getDetails$process === void 0 ? void 0 : _a$getDetails$process.start) || 0;
  const eventBStartTime = ((_b$getDetails = b.getDetails()) === null || _b$getDetails === void 0 ? void 0 : (_b$getDetails$process = _b$getDetails.process) === null || _b$getDetails$process === void 0 ? void 0 : _b$getDetails$process.start) || 0;
  if (eventAStartTime < eventBStartTime) {
    return -1;
  }
  if (eventAStartTime > eventBStartTime) {
    return 1;
  }
  return 0;
};
exports.sortProcesses = sortProcesses;