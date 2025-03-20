"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pageSize = exports.page = exports.fileNameWithExt = exports.fileName = exports.fileMeta = exports.fileAlt = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const ALPHA_NUMERIC_WITH_SPACES_REGEX = /^[a-z0-9\s_]+$/i;
const ALPHA_NUMERIC_WITH_SPACES_EXT_REGEX = /^[a-z0-9\s\._]+$/i;
function alphanumericValidation(v) {
  return ALPHA_NUMERIC_WITH_SPACES_REGEX.test(v) ? undefined : 'Only alphanumeric characters are allowed as file names';
}
function alphanumericWithExtValidation(v) {
  return ALPHA_NUMERIC_WITH_SPACES_EXT_REGEX.test(v) ? undefined : 'Only alphanumeric characters, spaces (" "), dots (".") and underscores ("_") are allowed';
}
const fileName = _configSchema.schema.string({
  minLength: 1,
  maxLength: 256,
  validate: alphanumericValidation
});
exports.fileName = fileName;
const fileNameWithExt = _configSchema.schema.string({
  minLength: 1,
  maxLength: 256,
  validate: alphanumericWithExtValidation
});
exports.fileNameWithExt = fileNameWithExt;
const fileAlt = _configSchema.schema.maybe(_configSchema.schema.string({
  minLength: 1,
  maxLength: 256,
  validate: alphanumericValidation
}));
exports.fileAlt = fileAlt;
const page = _configSchema.schema.number({
  min: 1,
  defaultValue: 1
});
exports.page = page;
const pageSize = _configSchema.schema.number({
  min: 1,
  defaultValue: 100
});
exports.pageSize = pageSize;
const fileMeta = _configSchema.schema.maybe(_configSchema.schema.object({}, {
  unknowns: 'allow'
}));
exports.fileMeta = fileMeta;