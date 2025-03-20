"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteIlms = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const deleteIlms = async (esClient, ilmPolicyIds) => {
  await Promise.all(ilmPolicyIds.map(async ilmPolicyId => {
    await esClient.transport.request({
      method: 'DELETE',
      path: `_ilm/policy/${ilmPolicyId}`
    }, {
      ignore: [404, 400]
    });
  }));
};
exports.deleteIlms = deleteIlms;