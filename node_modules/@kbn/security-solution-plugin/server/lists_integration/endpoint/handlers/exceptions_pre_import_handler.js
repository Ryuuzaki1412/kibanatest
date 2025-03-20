"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExceptionsPreImportHandler = void 0;
var _errors = require("../validators/errors");
var _constants = require("../../../../common/endpoint/service/artifacts/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getExceptionsPreImportHandler = () => {
  return async ({
    data
  }) => {
    const hasEndpointArtifactListOrListItems = [...data.lists, ...data.items].some(item => {
      if ('list_id' in item) {
        return _constants.ALL_ENDPOINT_ARTIFACT_LIST_IDS.includes(item.list_id);
      }
      return false;
    });
    if (hasEndpointArtifactListOrListItems) {
      throw new _errors.EndpointArtifactExceptionValidationError('Import is not supported for Endpoint artifact exceptions');
    }
    return data;
  };
};
exports.getExceptionsPreImportHandler = getExceptionsPreImportHandler;