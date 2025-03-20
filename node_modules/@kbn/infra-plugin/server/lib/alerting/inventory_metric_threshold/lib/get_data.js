"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getData = void 0;
var _create_request = require("./create_request");
var _utils = require("../../common/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createContainerList = containerContext => {
  const containerList = [];
  for (const containerBucket of containerContext.buckets) {
    var _containerBucket$cont;
    const containerHits = (_containerBucket$cont = containerBucket.container.hits) === null || _containerBucket$cont === void 0 ? void 0 : _containerBucket$cont.hits;
    const containerSource = containerHits && containerHits.length > 0 ? containerHits[0]._source : null;
    if (containerSource && containerSource.container) {
      containerList.push(containerSource.container);
    }
  }
  return containerList;
};
const getData = async (esClient, nodeType, metric, timerange, source, logQueryFields, compositeSize, condition, logger, filterQuery, customMetric, afterKey, previousNodes = {}) => {
  const handleResponse = (aggs, previous) => {
    const {
      nodes
    } = aggs;
    const nextAfterKey = nodes.after_key;
    for (const bucket of nodes.buckets) {
      var _bucket$additionalCon, _bucket$additionalCon2, _bucket$metricId$valu, _bucket$metricId, _ref, _ref2;
      const metricId = customMetric && customMetric.field ? customMetric.id : metric;
      const containerList = bucket.containerContext ? createContainerList(bucket.containerContext) : undefined;
      const bucketHits = (_bucket$additionalCon = bucket.additionalContext) === null || _bucket$additionalCon === void 0 ? void 0 : (_bucket$additionalCon2 = _bucket$additionalCon.hits) === null || _bucket$additionalCon2 === void 0 ? void 0 : _bucket$additionalCon2.hits;
      const additionalContextSource = bucketHits && bucketHits.length > 0 ? bucketHits[0]._source : null;
      previous[bucket.key.node] = {
        value: (_bucket$metricId$valu = bucket === null || bucket === void 0 ? void 0 : (_bucket$metricId = bucket[metricId]) === null || _bucket$metricId === void 0 ? void 0 : _bucket$metricId.value) !== null && _bucket$metricId$valu !== void 0 ? _bucket$metricId$valu : null,
        warn: (_ref = (bucket === null || bucket === void 0 ? void 0 : bucket.shouldWarn.value) > 0) !== null && _ref !== void 0 ? _ref : false,
        trigger: (_ref2 = (bucket === null || bucket === void 0 ? void 0 : bucket.shouldTrigger.value) > 0) !== null && _ref2 !== void 0 ? _ref2 : false,
        container: containerList,
        ...additionalContextSource
      };
    }
    if (nextAfterKey) {
      return getData(esClient, nodeType, metric, timerange, source, logQueryFields, compositeSize, condition, logger, filterQuery, customMetric, nextAfterKey, previous);
    }
    return previous;
  };
  const index = metric === 'logRate' && logQueryFields ? logQueryFields.indexPattern : source.configuration.metricAlias;
  const fieldsExisted = nodeType === 'pod' ? await (0, _utils.doFieldsExist)(esClient, [_utils.termsAggField[_utils.KUBERNETES_POD_UID]], index) : null;
  const request = (0, _create_request.createRequest)(index, nodeType, metric, timerange, compositeSize, afterKey, condition, filterQuery, customMetric, fieldsExisted);
  logger.trace(`Request: ${JSON.stringify(request)}`);
  const body = await esClient.search(request);
  logger.trace(`Response: ${JSON.stringify(body)}`);
  if (body.aggregations) {
    return handleResponse(body.aggregations, previousNodes);
  }
  return previousNodes;
};
exports.getData = getData;