"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMigrationSavedObject = void 0;
var _TaskEither = require("fp-ts/lib/TaskEither");
var _pipeable = require("fp-ts/lib/pipeable");
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _securitysolutionListApi = require("@kbn/securitysolution-list-api");
var _saved_objects_client = require("./saved_objects_client");
var _saved_objects_schema = require("./saved_objects_schema");
var _helpers = require("./helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const generateAttributes = username => {
  const now = (0, _helpers.getIsoDateString)();
  return {
    created: now,
    createdBy: username,
    updated: now,
    updatedBy: username
  };
};
const createMigrationSavedObject = async ({
  attributes,
  soClient,
  username
}) => {
  const client = (0, _saved_objects_client.signalsMigrationSOClient)(soClient);
  return (0, _pipeable.pipe)(attributes, attrs => (0, _securitysolutionIoTsUtils.validateTaskEither)(_saved_objects_schema.signalsMigrationSOCreateAttributes, attrs), (0, _TaskEither.chain)(validAttrs => (0, _TaskEither.tryCatch)(() => client.create({
    ...validAttrs,
    ...generateAttributes(username)
  }), _securitysolutionListApi.toError)), (0, _TaskEither.chain)(so => (0, _securitysolutionIoTsUtils.validateTaskEither)(_saved_objects_schema.signalsMigrationSO, so)), _securitysolutionListApi.toPromise);
};
exports.createMigrationSavedObject = createMigrationSavedObject;