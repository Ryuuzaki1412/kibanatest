"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.joinWithDash = exports.joinWith = exports.incrementIndexName = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const incrementIndexName = oldIndex => {
  const baseIndexString = oldIndex.slice(0, -6);
  const newIndexNumber = Number(oldIndex.slice(-6)) + 1;
  if (isNaN(newIndexNumber)) {
    return undefined;
  }
  return baseIndexString + String(newIndexNumber).padStart(6, '0');
};
exports.incrementIndexName = incrementIndexName;
const joinWith = separator => (...items) => {
  return items.filter(Boolean).map(String).join(separator);
};
exports.joinWith = joinWith;
const joinWithDash = joinWith('-');
exports.joinWithDash = joinWithDash;