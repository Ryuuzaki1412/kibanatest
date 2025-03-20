"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractSearchStrategy = void 0;
var _operators = require("rxjs/operators");
var _lodash = require("lodash");
var _fields_utils = require("../../../../common/fields_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function getRequestAbortedSignal(aborted$) {
  const controller = new AbortController();
  aborted$.subscribe(() => controller.abort());
  return controller.signal;
}
class AbstractSearchStrategy {
  async search(requestContext, req, esRequests, trackedEsSearches, indexType) {
    const requests = [];
    const searchContext = await requestContext.search;
    esRequests.forEach(({
      body,
      index,
      trackingEsSearchMeta
    }) => {
      // User may abort the request without waiting for the results
      // we need to handle this scenario by aborting underlying server requests
      const abortSignal = getRequestAbortedSignal(req.events.aborted$);
      const startTime = Date.now();
      requests.push(searchContext.search({
        indexType,
        params: {
          body,
          index
        }
      }, {
        ...req.body.searchSession,
        abortSignal
      }).pipe((0, _operators.tap)(data => {
        if (trackingEsSearchMeta !== null && trackingEsSearchMeta !== void 0 && trackingEsSearchMeta.requestId && trackedEsSearches) {
          trackedEsSearches[trackingEsSearchMeta.requestId] = {
            body,
            time: Date.now() - startTime,
            label: trackingEsSearchMeta.requestLabel,
            response: (0, _lodash.omit)(data.rawResponse, 'aggregations')
          };
        }
      })).toPromise());
    });
    return Promise.all(requests);
  }
  checkForViability(requestContext, req, fetchedIndexPattern) {
    throw new TypeError('Must override method');
  }
  async getFieldsForWildcard(fetchedIndexPattern, indexPatternsService, capabilities, options) {
    var _fetchedIndexPattern$;
    return (0, _fields_utils.toSanitizedFieldType)(fetchedIndexPattern.indexPattern ? fetchedIndexPattern.indexPattern.getNonScriptedFields() : await indexPatternsService.getFieldsForWildcard({
      pattern: (_fetchedIndexPattern$ = fetchedIndexPattern.indexPatternString) !== null && _fetchedIndexPattern$ !== void 0 ? _fetchedIndexPattern$ : '',
      metaFields: [],
      ...options
    }));
  }
}
exports.AbstractSearchStrategy = AbstractSearchStrategy;