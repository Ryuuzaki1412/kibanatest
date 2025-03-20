"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDeprecationLoggingRoutes = registerDeprecationLoggingRoutes;
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../common/constants");
var _es_deprecation_logging_apis = require("../lib/es_deprecation_logging_apis");
var _es_version_precheck = require("../lib/es_version_precheck");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerDeprecationLoggingRoutes({
  router,
  lib: {
    handleEsError
  }
}) {
  router.get({
    path: `${_constants.API_BASE_PATH}/deprecation_logging`,
    validate: false
  }, (0, _es_version_precheck.versionCheckHandlerWrapper)(async ({
    core
  }, request, response) => {
    try {
      const {
        elasticsearch: {
          client
        }
      } = await core;
      const result = await (0, _es_deprecation_logging_apis.getDeprecationLoggingStatus)(client);
      return response.ok({
        body: result
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
  router.put({
    path: `${_constants.API_BASE_PATH}/deprecation_logging`,
    validate: {
      body: _configSchema.schema.object({
        isEnabled: _configSchema.schema.boolean()
      })
    }
  }, (0, _es_version_precheck.versionCheckHandlerWrapper)(async ({
    core
  }, request, response) => {
    try {
      const {
        elasticsearch: {
          client
        }
      } = await core;
      const {
        isEnabled
      } = request.body;
      return response.ok({
        body: await (0, _es_deprecation_logging_apis.setDeprecationLogging)(client, isEnabled)
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
  router.get({
    path: `${_constants.API_BASE_PATH}/deprecation_logging/count`,
    validate: {
      query: _configSchema.schema.object({
        from: _configSchema.schema.string()
      })
    }
  }, (0, _es_version_precheck.versionCheckHandlerWrapper)(async ({
    core
  }, request, response) => {
    try {
      const {
        elasticsearch: {
          client
        }
      } = await core;
      const indexExists = await client.asCurrentUser.indices.exists({
        index: _constants.DEPRECATION_LOGS_INDEX
      });
      if (!indexExists) {
        return response.ok({
          body: {
            count: 0
          }
        });
      }
      const now = (0, _momentTimezone.default)().toISOString();
      const body = await client.asCurrentUser.count({
        index: _constants.DEPRECATION_LOGS_INDEX,
        body: {
          query: {
            bool: {
              must: {
                range: {
                  '@timestamp': {
                    gte: request.query.from,
                    lte: now
                  }
                }
              },
              must_not: {
                terms: {
                  [_constants.DEPRECATION_LOGS_ORIGIN_FIELD]: [..._constants.APPS_WITH_DEPRECATION_LOGS]
                }
              }
            }
          }
        }
      });
      return response.ok({
        body: {
          count: body.count
        }
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
  router.delete({
    path: `${_constants.API_BASE_PATH}/deprecation_logging/cache`,
    validate: false
  }, (0, _es_version_precheck.versionCheckHandlerWrapper)(async ({
    core
  }, request, response) => {
    try {
      const {
        elasticsearch: {
          client
        }
      } = await core;
      await client.asCurrentUser.transport.request({
        method: 'DELETE',
        path: '/_logging/deprecation_cache'
      });
      return response.ok({
        body: 'ok'
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
}