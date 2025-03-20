"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPlaceholderTextByOSType = exports.getPlaceholderText = void 0;
var _securitysolutionUtils = require("@kbn/securitysolution-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getPlaceholderText = () => ({
  windows: {
    wildcard: 'C:\\sample\\*\\path.exe',
    exact: 'C:\\sample\\path.exe'
  },
  others: {
    wildcard: '/opt/*/app',
    exact: '/opt/bin'
  }
});
exports.getPlaceholderText = getPlaceholderText;
const getPlaceholderTextByOSType = ({
  os,
  field,
  type
}) => {
  if (field === _securitysolutionUtils.ConditionEntryField.PATH) {
    if (os === _securitysolutionUtils.OperatingSystem.WINDOWS) {
      if (type === 'wildcard') {
        return getPlaceholderText().windows.wildcard;
      }
      return getPlaceholderText().windows.exact;
    } else {
      if (type === 'wildcard') {
        return getPlaceholderText().others.wildcard;
      }
      return getPlaceholderText().others.exact;
    }
  }
};
exports.getPlaceholderTextByOSType = getPlaceholderTextByOSType;