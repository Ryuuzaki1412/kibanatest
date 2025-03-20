"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildTimestampRuntimeMapping = void 0;
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildTimestampRuntimeMapping = ({
  timestampOverride
}) => {
  return {
    [_constants.TIMESTAMP_RUNTIME_FIELD]: {
      type: 'date',
      script: {
        source: `
              if (doc.containsKey(params.timestampOverride) && doc[params.timestampOverride].size()!=0) {
                emit(doc[params.timestampOverride].value.millis);
              } else {
                emit(doc['@timestamp'].value.millis);
              }
            `,
        params: {
          timestampOverride
        }
      }
    }
  };
};
exports.buildTimestampRuntimeMapping = buildTimestampRuntimeMapping;