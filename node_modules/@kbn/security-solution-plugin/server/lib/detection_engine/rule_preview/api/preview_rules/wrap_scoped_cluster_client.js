"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapScopedClusterClient = wrapScopedClusterClient;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function wrapScopedClusterClient(opts) {
  const {
    scopedClusterClient,
    ...rest
  } = opts;
  return {
    asInternalUser: wrapEsClient({
      ...rest,
      esClient: scopedClusterClient.asInternalUser
    }),
    asCurrentUser: wrapEsClient({
      ...rest,
      esClient: scopedClusterClient.asCurrentUser
    })
  };
}
function wrapEsClient(opts) {
  const {
    esClient,
    ...rest
  } = opts;
  const wrappedClient = esClient.child({});

  // Mutating the functions we want to wrap
  wrappedClient.search = getWrappedSearchFn({
    esClient: wrappedClient,
    ...rest
  });
  return wrappedClient;
}
function getWrappedSearchFn(opts) {
  const originalSearch = opts.esClient.search;

  // A bunch of overloads to make TypeScript happy

  async function search(params, options) {
    try {
      const searchOptions = options !== null && options !== void 0 ? options : {};
      return await originalSearch.call(opts.esClient, params, {
        ...searchOptions,
        signal: opts.abortController.signal
      });
    } catch (e) {
      if (opts.abortController.signal.aborted) {
        throw new Error('Search has been aborted due to cancelled execution');
      }
      throw e;
    }
  }
  return search;
}