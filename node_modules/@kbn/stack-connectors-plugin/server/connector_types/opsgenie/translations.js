"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UNKNOWN_ERROR = exports.OPSGENIE_NAME = exports.MESSAGE_NON_EMPTY = void 0;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const UNKNOWN_ERROR = _i18n.i18n.translate('xpack.stackConnectors.opsgenie.unknownError', {
  defaultMessage: 'unknown error'
});
exports.UNKNOWN_ERROR = UNKNOWN_ERROR;
const OPSGENIE_NAME = _i18n.i18n.translate('xpack.stackConnectors.opsgenie.name', {
  defaultMessage: 'Opsgenie'
});
exports.OPSGENIE_NAME = OPSGENIE_NAME;
const MESSAGE_NON_EMPTY = _i18n.i18n.translate('xpack.stackConnectors.components.opsgenie.nonEmptyMessageField', {
  defaultMessage: 'must be populated with a value other than just whitespace'
});
exports.MESSAGE_NON_EMPTY = MESSAGE_NON_EMPTY;