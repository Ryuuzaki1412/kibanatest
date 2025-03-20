"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggregateTaskOverduePercentilesForType = aggregateTaskOverduePercentilesForType;
var _mark_available_tasks_as_claimed = require("./mark_available_tasks_as_claimed");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function aggregateTaskOverduePercentilesForType(type) {
  return {
    query: {
      bool: {
        must: [{
          term: {
            'task.scope': {
              value: type
            }
          }
        }, {
          bool: {
            should: [_mark_available_tasks_as_claimed.IdleTaskWithExpiredRunAt, _mark_available_tasks_as_claimed.RunningOrClaimingTaskWithExpiredRetryAt]
          }
        }]
      }
    },
    runtime_mappings: {
      overdueBy: {
        type: 'long',
        script: {
          source: `
            def runAt = doc['task.runAt'];
            if(!runAt.empty) {
              emit(new Date().getTime() - runAt.value.getMillis());
            } else {
              def retryAt = doc['task.retryAt'];
              if(!retryAt.empty) {
                emit(new Date().getTime() - retryAt.value.getMillis());
              } else {
                emit(0);
              }
            }
          `
        }
      }
    },
    aggs: {
      overdueByPercentiles: {
        percentiles: {
          field: 'overdueBy',
          percents: [50, 99]
        }
      }
    }
  };
}