"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatLocation = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const formatLocation = location => {
  return {
    id: location.id,
    label: location.label,
    geo: location.geo,
    isServiceManaged: location.isServiceManaged
  };
};
exports.formatLocation = formatLocation;