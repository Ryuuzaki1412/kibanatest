"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createWrappedScopedClusterClientFactory = createWrappedScopedClusterClientFactory;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createWrappedScopedClusterClientFactory(opts) {
  let numSearches = 0;
  let esSearchDurationMs = 0;
  let totalSearchDurationMs = 0;
  function logMetrics(metrics) {
    numSearches++;
    esSearchDurationMs += metrics.esSearchDuration;
    totalSearchDurationMs += metrics.totalSearchDuration;
  }
  const wrappedClient = wrapScopedClusterClient({
    ...opts,
    logMetricsFn: logMetrics
  });
  return {
    client: () => wrappedClient,
    getMetrics: () => {
      return {
        esSearchDurationMs,
        totalSearchDurationMs,
        numSearches
      };
    }
  };
}
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
      var _took;
      const searchOptions = options !== null && options !== void 0 ? options : {};
      const start = Date.now();
      opts.logger.debug(`executing query for rule ${opts.rule.alertTypeId}:${opts.rule.id} in space ${opts.rule.spaceId} - ${JSON.stringify(params)} - with options ${JSON.stringify(searchOptions)}`);
      const result = await originalSearch.call(opts.esClient, params, {
        ...searchOptions,
        signal: opts.abortController.signal
      });
      const end = Date.now();
      const durationMs = end - start;
      let took = 0;
      if (searchOptions.meta) {
        // when meta: true, response is TransportResult<SearchResponse<TDocument, TAggregations>, unknown>
        took = result.body.took;
      } else {
        // when meta: false, response is SearchResponse<TDocument, TAggregations>
        took = result.took;
      }
      opts.logMetricsFn({
        esSearchDuration: (_took = took) !== null && _took !== void 0 ? _took : 0,
        totalSearchDuration: durationMs
      });
      return result;
    } catch (e) {
      if (opts.abortController.signal.aborted) {
        throw new Error('Search has been aborted due to cancelled execution');
      }
      throw e;
    }
  }
  return search;
}