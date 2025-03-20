"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noteFieldsMigrator = void 0;
var _constants = require("../../constants");
var _saved_object_mappings = require("../../saved_object_mappings");
var _migrator = require("../../utils/migrator");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * A migrator to handle moving specific fields that reference the timeline saved object to the references field within a note saved
 * object.
 */
const noteFieldsMigrator = new _migrator.FieldMigrator([{
  path: 'timelineId',
  type: _saved_object_mappings.timelineSavedObjectType,
  name: _constants.TIMELINE_ID_REF_NAME
}]);
exports.noteFieldsMigrator = noteFieldsMigrator;