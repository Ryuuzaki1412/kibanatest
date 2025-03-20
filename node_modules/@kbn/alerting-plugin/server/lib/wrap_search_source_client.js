"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapSearchSourceClient = wrapSearchSourceClient;
var _rxjs = require("rxjs");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function wrapSearchSourceClient({
  logger,
  rule,
  abortController,
  searchSourceClient: pureSearchSourceClient
}) {
  let numSearches = 0;
  let esSearchDurationMs = 0;
  let totalSearchDurationMs = 0;
  function logMetrics(metrics) {
    numSearches++;
    esSearchDurationMs += metrics.esSearchDuration;
    totalSearchDurationMs += metrics.totalSearchDuration;
  }
  const wrapParams = {
    logMetrics,
    logger,
    rule,
    abortController
  };
  const wrappedSearchSourceClient = Object.create(pureSearchSourceClient);
  wrappedSearchSourceClient.createEmpty = () => {
    const pureSearchSource = pureSearchSourceClient.createEmpty();
    return wrapSearchSource({
      ...wrapParams,
      pureSearchSource
    });
  };
  wrappedSearchSourceClient.create = async fields => {
    const pureSearchSource = await pureSearchSourceClient.create(fields);
    return wrapSearchSource({
      ...wrapParams,
      pureSearchSource
    });
  };
  return {
    searchSourceClient: wrappedSearchSourceClient,
    getMetrics: () => ({
      esSearchDurationMs,
      totalSearchDurationMs,
      numSearches
    })
  };
}
function wrapSearchSource({
  pureSearchSource,
  ...wrapParams
}) {
  const wrappedSearchSource = Object.create(pureSearchSource);
  wrappedSearchSource.createChild = wrapCreateChild({
    ...wrapParams,
    pureSearchSource
  });
  wrappedSearchSource.createCopy = wrapCreateCopy({
    ...wrapParams,
    pureSearchSource
  });
  wrappedSearchSource.create = wrapCreate({
    ...wrapParams,
    pureSearchSource
  });
  wrappedSearchSource.fetch$ = wrapFetch$({
    ...wrapParams,
    pureSearchSource
  });
  return wrappedSearchSource;
}
function wrapCreate({
  pureSearchSource,
  ...wrapParams
}) {
  return function () {
    const pureCreatedSearchSource = pureSearchSource.create();
    return wrapSearchSource({
      ...wrapParams,
      pureSearchSource: pureCreatedSearchSource
    });
  };
}
function wrapCreateChild({
  pureSearchSource,
  ...wrapParams
}) {
  return function (options) {
    const pureSearchSourceChild = pureSearchSource.createChild(options);
    return wrapSearchSource({
      ...wrapParams,
      pureSearchSource: pureSearchSourceChild
    });
  };
}
function wrapCreateCopy({
  pureSearchSource,
  ...wrapParams
}) {
  return function () {
    const pureSearchSourceChild = pureSearchSource.createCopy();
    return wrapSearchSource({
      ...wrapParams,
      pureSearchSource: pureSearchSourceChild
    });
  };
}
function wrapFetch$({
  logger,
  rule,
  abortController,
  pureSearchSource,
  logMetrics
}) {
  return options => {
    const searchOptions = options !== null && options !== void 0 ? options : {};
    const start = Date.now();
    logger.debug(`executing query for rule ${rule.alertTypeId}:${rule.id} in space ${rule.spaceId} - with options ${JSON.stringify(searchOptions)}`);
    return pureSearchSource.fetch$({
      ...searchOptions,
      abortSignal: abortController.signal
    }).pipe((0, _rxjs.catchError)(error => {
      if (abortController.signal.aborted) {
        return (0, _rxjs.throwError)(() => new Error('Search has been aborted due to cancelled execution'));
      }
      return (0, _rxjs.throwError)(() => error);
    }), (0, _rxjs.tap)(result => {
      var _result$rawResponse$t;
      const durationMs = Date.now() - start;
      logMetrics({
        esSearchDuration: (_result$rawResponse$t = result.rawResponse.took) !== null && _result$rawResponse$t !== void 0 ? _result$rawResponse$t : 0,
        totalSearchDuration: durationMs
      });
    }));
  };
}