"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApiKey = void 0;
var _to_alphanumeric = require("../../../common/utils/to_alphanumeric");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createApiKey = async (request, security, indexName, keyName) => {
  return await security.authc.apiKeys.create(request, {
    name: keyName,
    role_descriptors: {
      [`${(0, _to_alphanumeric.toAlphanumeric)(indexName)}-key-role`]: {
        cluster: [],
        index: [{
          names: [indexName],
          privileges: ['all']
        }]
      }
    }
  });
};
exports.createApiKey = createApiKey;