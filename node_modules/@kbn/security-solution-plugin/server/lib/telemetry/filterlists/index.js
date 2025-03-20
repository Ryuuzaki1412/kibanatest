"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilterList = void 0;
exports.copyAllowlistedFields = copyAllowlistedFields;
exports.filterList = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _endpoint_alerts = require("./endpoint_alerts");
var _exception_lists = require("./exception_lists");
var _prebuilt_rules_alerts = require("./prebuilt_rules_alerts");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Filters out Key/Values not required for downstream analysis
 * @returns TelemetryEvent with explicitly required fields
 */
function copyAllowlistedFields(allowlist, event) {
  return Object.entries(allowlist).reduce((newEvent, [allowKey, allowValue]) => {
    const eventValue = event[allowKey];
    if (eventValue !== null && eventValue !== undefined) {
      if (allowValue === true) {
        return {
          ...newEvent,
          [allowKey]: eventValue
        };
      } else if (typeof allowValue === 'object' && Array.isArray(eventValue)) {
        const subValues = eventValue.filter(v => typeof v === 'object');
        return {
          ...newEvent,
          [allowKey]: subValues.map(v => copyAllowlistedFields(allowValue, v))
        };
      } else if (typeof allowValue === 'object' && typeof eventValue === 'object') {
        const values = copyAllowlistedFields(allowValue, eventValue);
        return {
          ...newEvent,
          ...(Object.keys(values).length > 0 ? {
            [allowKey]: values
          } : {})
        };
      }
    }
    return newEvent;
  }, {});
}
class FilterList {
  constructor() {
    (0, _defineProperty2.default)(this, "_endpointAlerts", _endpoint_alerts.endpointAllowlistFields);
    (0, _defineProperty2.default)(this, "_exceptionLists", _exception_lists.exceptionListAllowlistFields);
    (0, _defineProperty2.default)(this, "_prebuiltRulesAlerts", _prebuilt_rules_alerts.prebuiltRuleAllowlistFields);
  }
  get endpointAlerts() {
    return this._endpointAlerts;
  }
  set endpointAlerts(list) {
    this._endpointAlerts = list;
  }
  get exceptionLists() {
    return this._exceptionLists;
  }
  set exceptionLists(list) {
    this._exceptionLists = list;
  }
  get prebuiltRulesAlerts() {
    return this._prebuiltRulesAlerts;
  }
  set prebuiltRulesAlerts(list) {
    this._prebuiltRulesAlerts = list;
  }
  resetAllToDefault() {
    this._endpointAlerts = _endpoint_alerts.endpointAllowlistFields;
    this._exceptionLists = _exception_lists.exceptionListAllowlistFields;
    this._prebuiltRulesAlerts = _prebuilt_rules_alerts.prebuiltRuleAllowlistFields;
  }
}
exports.FilterList = FilterList;
const filterList = new FilterList();
exports.filterList = filterList;