"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VIEW_IN_KIBANA = exports.VIEW_ALERTS_IN_KIBANA = exports.UNKNOWN = exports.CASE_URL = exports.ALERTS_URL = exports.ADDED_BY = void 0;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ADDED_BY = user => _i18n.i18n.translate('xpack.cases.server.addedBy', {
  defaultMessage: 'Added by {user}',
  values: {
    user
  }
});
exports.ADDED_BY = ADDED_BY;
const VIEW_IN_KIBANA = _i18n.i18n.translate('xpack.cases.server.viewCaseInKibana', {
  defaultMessage: 'For more details, view this case in Kibana'
});
exports.VIEW_IN_KIBANA = VIEW_IN_KIBANA;
const VIEW_ALERTS_IN_KIBANA = _i18n.i18n.translate('xpack.cases.server.viewAlertsInKibana', {
  defaultMessage: 'For more details, view the alerts in Kibana'
});
exports.VIEW_ALERTS_IN_KIBANA = VIEW_ALERTS_IN_KIBANA;
const CASE_URL = url => _i18n.i18n.translate('xpack.cases.server.caseUrl', {
  defaultMessage: 'Case URL: {url}',
  values: {
    url
  }
});
exports.CASE_URL = CASE_URL;
const ALERTS_URL = url => _i18n.i18n.translate('xpack.cases.server.alertsUrl', {
  defaultMessage: 'Alerts URL: {url}',
  values: {
    url
  }
});
exports.ALERTS_URL = ALERTS_URL;
const UNKNOWN = _i18n.i18n.translate('xpack.cases.server.unknown', {
  defaultMessage: 'Unknown'
});
exports.UNKNOWN = UNKNOWN;