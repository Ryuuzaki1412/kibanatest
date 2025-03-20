"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAlerts = void 0;
var _ruleDataUtils = require("@kbn/rule-data-utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getAlerts = async ({
  esClient,
  signalsIndex,
  maxSize,
  maxPerPage,
  logger
}) => {
  // default is from looking at Kibana saved objects and online documentation
  const keepAlive = '5m';

  // create and assign an initial point in time
  let pitId = (await esClient.openPointInTime({
    index: signalsIndex,
    keep_alive: keepAlive
  })).id;
  let after;
  let buckets = [];
  let fetchMore = true;
  while (fetchMore) {
    var _body$aggregations, _body$aggregations$bu, _body$aggregations2, _body$aggregations2$b, _body$aggregations3, _body$aggregations3$b, _body$aggregations4, _body$aggregations4$b;
    const ruleSearchOptions = {
      aggs: {
        buckets: {
          composite: {
            size: Math.min(maxPerPage, maxSize - buckets.length),
            sources: [{
              detectionAlerts: {
                terms: {
                  field: _ruleDataUtils.ALERT_RULE_UUID
                }
              }
            }],
            after
          }
        }
      },
      query: {
        bool: {
          filter: [{
            range: {
              '@timestamp': {
                gte: 'now-24h',
                lte: 'now'
              }
            }
          }]
        }
      },
      track_total_hits: false,
      sort: [{
        _shard_doc: 'desc'
      }],
      // TODO: Remove this "unknown" once it is typed correctly https://github.com/elastic/elasticsearch-js/issues/1589
      pit: {
        id: pitId
      },
      size: 0
    };
    logger.debug(`Getting alerts with point in time (PIT) query: ${JSON.stringify(ruleSearchOptions)}`);
    const body = await esClient.search(ruleSearchOptions);
    if (((_body$aggregations = body.aggregations) === null || _body$aggregations === void 0 ? void 0 : (_body$aggregations$bu = _body$aggregations.buckets) === null || _body$aggregations$bu === void 0 ? void 0 : _body$aggregations$bu.buckets) != null) {
      buckets = [...buckets, ...body.aggregations.buckets.buckets];
    }
    if (((_body$aggregations2 = body.aggregations) === null || _body$aggregations2 === void 0 ? void 0 : (_body$aggregations2$b = _body$aggregations2.buckets) === null || _body$aggregations2$b === void 0 ? void 0 : _body$aggregations2$b.after_key) != null) {
      after = {
        detectionAlerts: body.aggregations.buckets.after_key.detectionAlerts
      };
    }
    fetchMore = ((_body$aggregations3 = body.aggregations) === null || _body$aggregations3 === void 0 ? void 0 : (_body$aggregations3$b = _body$aggregations3.buckets) === null || _body$aggregations3$b === void 0 ? void 0 : _body$aggregations3$b.buckets) != null && ((_body$aggregations4 = body.aggregations) === null || _body$aggregations4 === void 0 ? void 0 : (_body$aggregations4$b = _body$aggregations4.buckets) === null || _body$aggregations4$b === void 0 ? void 0 : _body$aggregations4$b.buckets.length) !== 0 && buckets.length < maxSize;
    if (body.pit_id != null) {
      pitId = body.pit_id;
    }
  }
  try {
    await esClient.closePointInTime({
      id: pitId
    });
  } catch (error) {
    // Don't fail due to a bad point in time closure. We have seen failures in e2e tests during nominal operations.
    logger.warn(`Error trying to close point in time: "${pitId}", it will expire within "${keepAlive}". Error is: "${error}"`);
  }
  logger.debug(`Returning alerts response of length: "${buckets.length}"`);
  return buckets;
};
exports.getAlerts = getAlerts;