"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMigrations841 = void 0;
var _lodash = require("lodash");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function removeIsSnoozedUntil(doc) {
  return {
    ...doc,
    attributes: {
      ...(0, _lodash.omit)(doc.attributes, ['isSnoozedUntil'])
    }
  };
}
const getMigrations841 = encryptedSavedObjects => (0, _utils.createEsoMigration)(encryptedSavedObjects, doc => true, (0, _utils.pipeMigrations)(removeIsSnoozedUntil));
exports.getMigrations841 = getMigrations841;