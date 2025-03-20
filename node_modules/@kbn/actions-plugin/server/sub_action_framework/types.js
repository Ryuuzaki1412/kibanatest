"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidatorType = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let ValidatorType;
exports.ValidatorType = ValidatorType;
(function (ValidatorType) {
  ValidatorType[ValidatorType["CONFIG"] = 0] = "CONFIG";
  ValidatorType[ValidatorType["SECRETS"] = 1] = "SECRETS";
})(ValidatorType || (exports.ValidatorType = ValidatorType = {}));