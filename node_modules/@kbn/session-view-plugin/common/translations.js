"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ALERT_TYPE_TOOLTIP_PROCESS = exports.ALERT_TYPE_TOOLTIP_NETWORK = exports.ALERT_TYPE_TOOLTIP_FILE = void 0;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ALERT_TYPE_TOOLTIP_PROCESS = _i18n.i18n.translate('xpack.sessionView.processTooltip', {
  defaultMessage: 'Process alert'
});
exports.ALERT_TYPE_TOOLTIP_PROCESS = ALERT_TYPE_TOOLTIP_PROCESS;
const ALERT_TYPE_TOOLTIP_NETWORK = _i18n.i18n.translate('xpack.sessionView.networkTooltip', {
  defaultMessage: 'Network alert'
});
exports.ALERT_TYPE_TOOLTIP_NETWORK = ALERT_TYPE_TOOLTIP_NETWORK;
const ALERT_TYPE_TOOLTIP_FILE = _i18n.i18n.translate('xpack.sessionView.fileTooltip', {
  defaultMessage: 'File alert'
});
exports.ALERT_TYPE_TOOLTIP_FILE = ALERT_TYPE_TOOLTIP_FILE;