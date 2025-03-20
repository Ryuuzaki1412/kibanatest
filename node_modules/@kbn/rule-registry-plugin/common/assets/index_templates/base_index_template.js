"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.baseIndexTemplate = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const baseIndexTemplate = {
  template: {
    settings: {
      number_of_shards: 1,
      number_of_replicas: 0
    }
  }
};
exports.baseIndexTemplate = baseIndexTemplate;