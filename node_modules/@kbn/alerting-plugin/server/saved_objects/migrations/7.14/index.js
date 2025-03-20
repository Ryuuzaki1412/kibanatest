"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMigrations7140 = void 0;
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * The author field was introduced later and was not part of the original rules. We overlooked
 * the filling in the author field as an empty array in an earlier upgrade routine from
 * 'removeNullsFromSecurityRules' during the 7.13.0 upgrade. Since we don't change earlier migrations,
 * but rather only move forward with the "arrow of time" we are going to upgrade and fix
 * it if it is missing for anyone in 7.14.0 and above release. Earlier releases if we want to fix them,
 * would have to be modified as a "7.13.1", etc... if we want to fix it there.
 * @param doc The document that is not migrated and contains a "null" or "undefined" author field
 * @returns The document with the author field fleshed in.
 */
function removeNullAuthorFromSecurityRules(doc) {
  const {
    attributes: {
      params
    }
  } = doc;
  return {
    ...doc,
    attributes: {
      ...doc.attributes,
      params: {
        ...params,
        author: params.author != null ? params.author : []
      }
    }
  };
}
const getMigrations7140 = encryptedSavedObjects => (0, _utils.createEsoMigration)(encryptedSavedObjects, doc => (0, _utils.isSiemSignalsRuleType)(doc), (0, _utils.pipeMigrations)(removeNullAuthorFromSecurityRules));
exports.getMigrations7140 = getMigrations7140;