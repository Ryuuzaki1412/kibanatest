"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMigrationSavedObjectsById = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Either = require("fp-ts/lib/Either");
var _pipeable = require("fp-ts/lib/pipeable");
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _saved_objects_client = require("./saved_objects_client");
var _saved_objects_schema = require("./saved_objects_schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class MigrationResponseError extends Error {
  constructor(message, statusCode) {
    super(message);
    (0, _defineProperty2.default)(this, "statusCode", void 0);
    this.statusCode = statusCode;
  }
}

/**
 * Retrieves a list of migrations SOs by their ID
 *
 * @param soClient An {@link SavedObjectsClientContract}
 * @param ids IDs of the migration SOs
 *
 * @returns a list of {@link SignalsMigrationSO[]}
 *
 * @throws if client returns an error
 */
const getMigrationSavedObjectsById = async ({
  ids,
  soClient
}) => {
  var _migrations$find;
  const client = (0, _saved_objects_client.signalsMigrationSOClient)(soClient);
  const objects = ids.map(id => ({
    id
  }));
  const {
    saved_objects: migrations
  } = await client.bulkGet(objects);
  const error = (_migrations$find = migrations.find(migration => migration.error)) === null || _migrations$find === void 0 ? void 0 : _migrations$find.error;
  if (error) {
    throw new MigrationResponseError(error.message, error.statusCode);
  }
  return (0, _pipeable.pipe)(migrations, ms => (0, _securitysolutionIoTsUtils.validateEither)(_saved_objects_schema.signalsMigrationSOs, ms), (0, _Either.fold)(e => Promise.reject(e), a => Promise.resolve(a)));
};
exports.getMigrationSavedObjectsById = getMigrationSavedObjectsById;