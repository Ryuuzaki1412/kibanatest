"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = void 0;
var _configSchema = require("@kbn/config-schema");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getEndpoint = (method, path) => `${method.toUpperCase()} ${path}`;
const increaseTelemetryCounters = ({
  telemetryUsageCounter,
  method,
  path,
  isKibanaRequest,
  isError = false
}) => {
  const counterName = getEndpoint(method, path);
  telemetryUsageCounter.incrementCounter({
    counterName,
    counterType: isError ? 'error' : 'success'
  });
  telemetryUsageCounter.incrementCounter({
    counterName,
    counterType: `kibanaRequest.${isKibanaRequest ? 'yes' : 'no'}`
  });
};
const logAndIncreaseDeprecationTelemetryCounters = ({
  logger,
  headers,
  method,
  path,
  telemetryUsageCounter
}) => {
  const endpoint = getEndpoint(method, path);
  (0, _utils.logDeprecatedEndpoint)(logger, headers, `The endpoint ${endpoint} is deprecated.`);
  if (telemetryUsageCounter) {
    telemetryUsageCounter.incrementCounter({
      counterName: endpoint,
      counterType: 'deprecated'
    });
  }
};
const registerRoutes = deps => {
  const {
    router,
    routes,
    logger,
    kibanaVersion,
    telemetryUsageCounter
  } = deps;
  routes.forEach(route => {
    var _params$params, _params$query, _params$body;
    const {
      method,
      path,
      params,
      options,
      routerOptions,
      handler
    } = route;
    router[method]({
      path,
      options: routerOptions,
      validate: {
        params: (_params$params = params === null || params === void 0 ? void 0 : params.params) !== null && _params$params !== void 0 ? _params$params : _utils.escapeHatch,
        query: (_params$query = params === null || params === void 0 ? void 0 : params.query) !== null && _params$query !== void 0 ? _params$query : _utils.escapeHatch,
        body: (_params$body = params === null || params === void 0 ? void 0 : params.body) !== null && _params$body !== void 0 ? _params$body : _configSchema.schema.nullable(_utils.escapeHatch)
      }
    }, async (context, request, response) => {
      let responseHeaders = {};
      const isKibanaRequest = (0, _utils.getIsKibanaRequest)(request.headers);
      if (!context.cases) {
        return response.badRequest({
          body: 'RouteHandlerContext is not registered for cases'
        });
      }
      try {
        if (options !== null && options !== void 0 && options.deprecated) {
          logAndIncreaseDeprecationTelemetryCounters({
            telemetryUsageCounter,
            logger,
            path,
            method,
            headers: request.headers
          });
          responseHeaders = {
            ...responseHeaders,
            ...(0, _utils.getWarningHeader)(kibanaVersion)
          };
        }
        const res = await handler({
          logger,
          context,
          request,
          response,
          kibanaVersion
        });
        if (telemetryUsageCounter) {
          increaseTelemetryCounters({
            telemetryUsageCounter,
            method,
            path,
            isKibanaRequest
          });
        }
        res.options.headers = {
          ...res.options.headers,
          ...responseHeaders
        };
        return res;
      } catch (error) {
        logger.error(error.message);
        if (telemetryUsageCounter) {
          increaseTelemetryCounters({
            telemetryUsageCounter,
            method,
            path,
            isError: true,
            isKibanaRequest
          });
        }
        return response.customError((0, _utils.wrapError)(error));
      }
    });
  });
};
exports.registerRoutes = registerRoutes;