"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDuplicates = void 0;
var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getDuplicates = (ruleDefinitions, by) => {
  const mappedDuplicates = (0, _fp.countBy)(by, ruleDefinitions.filter(r => r[by] != null));
  const hasDuplicates = Object.values(mappedDuplicates).some(i => i > 1);
  if (hasDuplicates) {
    return Object.keys(mappedDuplicates).filter(key => mappedDuplicates[key] > 1);
  }
  return [];
};
exports.getDuplicates = getDuplicates;